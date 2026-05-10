const MOCK_USER = { id: 'mock-user-id', email: 'test@example.com' };

const MOCK_INDEX = JSON.stringify([
  { projectId: 'proj-1', title: 'The Road Not Taken', lastModified: new Date(Date.now() - 86400000).toISOString() },
  { projectId: 'proj-2', title: 'Ode to Autumn', lastModified: new Date(Date.now() - 172800000).toISOString() },
  { projectId: 'proj-3', title: 'The Waste Land', lastModified: new Date(Date.now() - 259200000).toISOString() },
]);

const MOCK_PROJECT = JSON.stringify({
  projectId: 'proj-1',
  version: '1.0',
  title: 'The Road Not Taken',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  lastModified: new Date(Date.now() - 3600000).toISOString(),
  poem: {
    content: '<p>Two roads diverged in a yellow wood,<br/>And sorry I could not travel both...</p>',
    highlights: [],
  },
  notes: [
    {
      id: 'note-context', content: 'Written in 1916 by Robert Frost', position: { x: 50, y: 50 },
      textReferences: [], linkedNotes: [], createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(), type: 'context', isCollapsed: false,
    },
  ],
  connections: [],
});

function mockBlob(text: string) {
  return { text: async () => text } as unknown as Blob;
}

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
    getSession: async () => ({ data: { session: { user: MOCK_USER } }, error: null }),
    onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
      setTimeout(() => cb('SIGNED_IN', { user: MOCK_USER }), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => ({ data: { user: MOCK_USER }, error: null }),
    signUp: async () => ({ data: { user: MOCK_USER }, error: null }),
    signOut: async () => ({ error: null }),
    updateUser: async () => ({ data: { user: MOCK_USER }, error: null }),
  },
  from: (_table: string) => {
    const builder: Record<string, unknown> = {
      data: [],
      error: null,
      select: () => builder,
      eq: () => builder,
      single: () => ({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => builder,
      then: (resolve: (v: { data: unknown[]; error: null }) => void) =>
        Promise.resolve({ data: [], error: null }).then(resolve),
    };
    return builder;
  },
  storage: {
    from: (_bucket: string) => ({
      download: async (path: string) => {
        if (path.endsWith('_index.json')) return { data: mockBlob(MOCK_INDEX), error: null };
        if (path.includes('proj-1')) return { data: mockBlob(MOCK_PROJECT), error: null };
        return { data: null, error: { message: 'Not found' } };
      },
      upload: async () => ({ data: null, error: null }),
      remove: async () => ({ data: null, error: null }),
    }),
  },
};

export const BUCKET = 'poetry-notes-projects';
