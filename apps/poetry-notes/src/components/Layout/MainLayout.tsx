import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Header } from './Header';
import { PoemEditor } from '../Editor/PoemEditor';
import { NotesCanvas } from '../Notes/NotesCanvas';
import './MainLayout.css';
import { useProject } from '../../contexts/ProjectContext';
import type { Camera } from '../../types';
import { useTourStyles } from '@repo/ui';
import { useTour } from '../../useTour';
import { Joyride, type EventData, STATUS } from 'react-joyride';

const EDITOR_TOUR_STEPS = [
    {
        target: '[data-tour="poem-panel"]',
        title: 'The Poem Canvas',
        content: 'Paste or type your poem here. This is the centre of your annotation workspace.',
        placement: 'right' as const,
        disableBeacon: true,
    },
    {
        target: '[data-tour="select-hint"]',
        title: 'Create Annotations',
        content: 'Select any text in the poem and click "+ Note" to create a linked annotation. Tour complete — happy annotating!',
        placement: 'right' as const,
    },
];

interface MainLayoutProps {
    onBackToLanding: () => void;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 4.0;

export function MainLayout({ onBackToLanding }: MainLayoutProps) {
    const { viewState, setViewState } = useProject();
    const [editorRef, setEditorRef] = React.useState<HTMLDivElement | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const { completed: editorTourDone, complete: completeEditorTour } = useTour('poetry-notes-editor');
    const editorTourStyles = useTourStyles();

    function handleEditorTourCallback({ status }: EventData) {
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) completeEditorTour();
    }
    const viewportRef = useRef<HTMLDivElement>(null);
    const lastPointerRef = useRef({ x: 0, y: 0 });

    const camera = viewState.camera;

    const setCamera = useCallback((updater: (prev: Camera) => Camera) => {
        setViewState(prev => ({ ...prev, camera: updater(prev.camera) }));
    }, [setViewState]);

    // Attach non-passive wheel listener so we can preventDefault
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const rect = el.getBoundingClientRect();

            if (e.ctrlKey || e.metaKey) {
                // Pinch-to-zoom or Ctrl+scroll: zoom around cursor
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                setCamera(prev => {
                    const worldX = mouseX / prev.zoom + prev.x;
                    const worldY = mouseY / prev.zoom + prev.y;
                    const factor = Math.exp(-e.deltaY * 0.005);
                    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom * factor));
                    return {
                        x: worldX - mouseX / newZoom,
                        y: worldY - mouseY / newZoom,
                        zoom: newZoom,
                    };
                });
            } else {
                // Two-finger scroll: pan
                setCamera(prev => ({
                    ...prev,
                    x: prev.x + e.deltaX / prev.zoom,
                    y: prev.y + e.deltaY / prev.zoom,
                }));
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [setCamera]);

    // Pointer-drag pan on empty canvas
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest('.note') ||
            target.closest('.poem-panel') ||
            target.closest('.note-connections-svg')
        ) return;

        // Prevent the browser from starting a text selection drag
        e.preventDefault();
        setIsPanning(true);
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isPanning) return;
        const dx = e.clientX - lastPointerRef.current.x;
        const dy = e.clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        setCamera(prev => ({
            ...prev,
            x: prev.x - dx / prev.zoom,
            y: prev.y - dy / prev.zoom,
        }));
    }, [isPanning, setCamera]);

    const handlePointerUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    const transform = `translate(${-camera.x * camera.zoom}px, ${-camera.y * camera.zoom}px) scale(${camera.zoom})`;

    return (
        <div className="main-layout">
            <Joyride
                steps={EDITOR_TOUR_STEPS}
                run={!editorTourDone}
                continuous
                onEvent={handleEditorTourCallback}
                options={{ showProgress: true, buttons: ['back', 'primary', 'skip'] }}
                styles={editorTourStyles}
                locale={{ last: 'Done' }}
            />
            <Header onBackToLanding={onBackToLanding} />

            <div
                ref={viewportRef}
                className={`viewport${isPanning ? ' is-panning' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div
                    className="content-layer"
                    style={{ transform, transformOrigin: '0 0' }}
                >
                    {/* Notes and arrows — absolute, fills content-layer */}
                    <div className="notes-panel">
                        <NotesCanvas
                            editorRef={editorRef}
                            camera={camera}
                        />
                    </div>

                    {/* Poem editor — centered via margin: auto */}
                    <div className="poem-panel" data-tour="poem-panel">
                        <div className="panel-header">
                            <h2>Poem</h2>
                            <span className="panel-hint" data-tour="select-hint">Select text to create notes</span>
                        </div>
                        <div className="panel-content">
                            <PoemEditor onEditorRef={setEditorRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
