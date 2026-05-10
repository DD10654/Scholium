import { useRef, useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useProject } from '../contexts/ProjectContext';
import type { ProjectIndexEntry } from '../contexts/ProjectContext';
import { AppHeroHeader, useTourStyles } from '@repo/ui';
import type { AppLink } from '@repo/ui';
import '@repo/ui/app-hero-header.css';
import { supabase } from '../integrations/supabase/client';
import { useTour } from '../useTour';
import { Joyride, type EventData, STATUS } from 'react-joyride';

const TOUR_STEPS = [
  {
    target: '[data-tour="hero"]',
    title: 'Welcome to Poetry Notes!',
    content: 'Annotate poems and build interconnected notes, saved securely to the cloud.',
    placement: 'bottom' as const,
    disableBeacon: true,
  },
  {
    target: '[data-tour="continue-project"]',
    title: 'Continue a Project',
    content: 'Open and manage any of your previously saved poetry projects.',
    placement: 'bottom' as const,
  },
  {
    target: '[data-tour="new-project"]',
    title: 'New Project',
    content: 'Start a fresh annotation workspace — click here to create your first project and continue the tour inside the editor!',
    placement: 'bottom' as const,
  },
  {
    target: '[data-tour="import-project"]',
    title: 'Import from File',
    content: 'Load a previously exported JSON project file to continue working on it.',
    placement: 'bottom' as const,
  },
  {
    target: '[data-tour="settings-btn"]',
    title: 'Settings',
    content: 'Toggle dark mode and manage your account here.',
    placement: 'bottom-end' as const,
  },
];
import './LandingPage.css';
import './LandingPageProjects.css';

interface LandingPageProps {
    onProjectReady: () => void;
    onSettings: () => void;
}

type Screen = 'home' | 'open';

export function LandingPage({ onProjectReady, onSettings }: LandingPageProps) {
    const { createNewProject, importProject, loadProjectList, openProject, deleteProject } = useProject();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [screen, setScreen] = useState<Screen>('home');
    const { completed: tourDone, complete: completeTour } = useTour('poetry-notes');
    const tourStylesLive = useTourStyles();
    const [apps, setApps] = useState<AppLink[] | undefined>(undefined);

    useEffect(() => {
        supabase.from('scholium_apps').select('id, title, url, icon').order('sort_order')
            .then(({ data }) => setApps((data ?? []) as AppLink[]));
    }, []);

    function handleTourCallback({ status }: EventData) {
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) completeTour();
    }
    const [projects, setProjects] = useState<ProjectIndexEntry[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [openingId, setOpeningId] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoadingList(true);
        const list = await loadProjectList();
        setProjects(list.sort((a, b) => b.lastModified.localeCompare(a.lastModified)));
        setLoadingList(false);
    }, [loadProjectList]);

    useEffect(() => {
        if (screen === 'open') fetchProjects();
    }, [screen, fetchProjects]);

    const handleCreateNew = async () => {
        try {
            await createNewProject();
            onProjectReady();
        } catch {
            setError('Failed to create project. Please try again.');
        }
    };

    const handleOpen = async (projectId: string) => {
        setOpeningId(projectId);
        try {
            await openProject(projectId);
            onProjectReady();
        } catch {
            setError('Failed to open project. Please try again.');
        } finally {
            setOpeningId(null);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        setDeletingId(projectId);
        try {
            await deleteProject(projectId);
            setProjects(prev => prev.filter(p => p.projectId !== projectId));
        } catch {
            setError('Failed to delete project. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.json')) { setError('Please select a valid JSON project file'); return; }
        try {
            await importProject(file);
            setError(null);
            onProjectReady();
        } catch {
            setError('Failed to import project. Please check the file format.');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (screen === 'open') {
        return (
            <div className="landing-page">
                <AppHeroHeader
                    title="📝 Poetry Notes"
                    subtitle="Your saved projects"
                    onSettings={onSettings}
                    apps={apps}
                />
                <div className="landing-content">
                    <div className="projects-toolbar">
                        <button className="projects-back-btn" onClick={() => setScreen('home')}>← Back</button>
                        <button className="projects-new-btn" onClick={handleCreateNew}>+ New</button>
                    </div>
                    {loadingList ? (
                        <div className="projects-loading">Loading…</div>
                    ) : projects.length === 0 ? (
                        <div className="projects-empty">No saved projects yet.</div>
                    ) : (
                        <ul className="projects-list">
                            {projects.map(p => (
                                <li key={p.projectId} className="project-item">
                                    <button
                                        className="project-open-btn"
                                        onClick={() => handleOpen(p.projectId)}
                                        disabled={openingId === p.projectId}
                                    >
                                        <span className="project-title">{p.title || 'Untitled Project'}</span>
                                        <span className="project-date">
                                            {new Date(p.lastModified).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </span>
                                        {openingId === p.projectId && <span className="project-loading">Opening…</span>}
                                    </button>
                                    <button
                                        className="project-delete-btn"
                                        onClick={() => handleDelete(p.projectId)}
                                        disabled={deletingId === p.projectId}
                                        aria-label="Delete project"
                                    >
                                        {deletingId === p.projectId ? '…' : '🗑'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="landing-page">
            <Joyride
                steps={TOUR_STEPS}
                run={!tourDone && screen === 'home'}
                continuous
                onEvent={handleTourCallback}
                options={{ showProgress: true, buttons: ['back', 'primary', 'skip'] }}
                styles={tourStylesLive}
                locale={{ last: 'Done' }}
            />

            <AppHeroHeader
                title="📝 Poetry Notes"
                subtitle="Annotate and explore poetry with interconnected notes"
                onSettings={onSettings}
                apps={apps}
            />

            <div className="landing-content">
                <div className="landing-actions">
                    <button className="action-button primary" onClick={() => setScreen('open')} data-tour="continue-project">
                        <span className="button-icon">📂</span>
                        <span className="button-text">
                            <span className="button-title">Continue Project</span>
                            <span className="button-subtitle">Open or manage your saved notes</span>
                        </span>
                    </button>

                    <button className="action-button" onClick={handleCreateNew} data-tour="new-project">
                        <span className="button-icon">✨</span>
                        <span className="button-text">
                            <span className="button-title">New Project</span>
                            <span className="button-subtitle">Start a fresh annotation</span>
                        </span>
                    </button>

                    <button className="action-button" onClick={handleUploadClick} data-tour="import-project">
                        <span className="button-icon">📤</span>
                        <span className="button-text">
                            <span className="button-title">Import from File</span>
                            <span className="button-subtitle">Load a JSON project file</span>
                        </span>
                    </button>

                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
