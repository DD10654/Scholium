const MOCK_USER = { id: 'mock-user-id', email: 'test@example.com' };

const MOCK_SUBJECTS = [
  { id: 'subj-1', name: 'Economics', emoji: '📈', accent: 'blue' },
  { id: 'subj-2', name: 'History', emoji: '📜', accent: 'orange' },
];

const MOCK_SECTIONS = [
  { id: 'sec-1', name: 'Macroeconomics', subject_id: 'subj-1' },
  { id: 'sec-2', name: 'Microeconomics', subject_id: 'subj-1' },
];

const MOCK_CHAPTERS = [
  { id: 'ch-1', name: 'Supply and Demand', section_id: 'sec-1', sort_order: 1 },
  { id: 'ch-2', name: 'GDP and Growth', section_id: 'sec-1', sort_order: 2 },
  { id: 'ch-3', name: 'Market Structures', section_id: 'sec-2', sort_order: 1 },
];

const MOCK_CARDS = [
  { term: 'GDP', definition: 'The total monetary value of all goods and services produced in a country in a given period.', chapter_id: 'ch-1', sort_order: 1 },
  { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.', chapter_id: 'ch-1', sort_order: 2 },
  { term: 'Supply', definition: 'The total amount of a product or service available for purchase in a market.', chapter_id: 'ch-1', sort_order: 3 },
  { term: 'Demand', definition: 'The consumer desire and willingness to pay for a specific good or service.', chapter_id: 'ch-1', sort_order: 4 },
  { term: 'Elasticity', definition: 'A measure of the responsiveness of one economic variable to a change in another.', chapter_id: 'ch-1', sort_order: 5 },
];

const MOCK_PASSES: Record<string, number> = { 'ch-1': 1, 'ch-2': 2, 'ch-3': 3 };

function makeQueryBuilder(data: unknown[]) {
  const builder: Record<string, unknown> = {
    data,
    error: null,
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    order: () => builder,
    upsert: () => Promise.resolve({ data: null, error: null }),
    delete: () => builder,
    single: () => ({ data: data[0] ?? null, error: null }),
    then: (resolve: (v: { data: unknown; error: null }) => void) =>
      Promise.resolve({ data, error: null }).then(resolve),
  };
  return builder;
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
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ data: { user: MOCK_USER }, error: null }),
  },
  from: (table: string) => {
    const tableData: Record<string, unknown[]> = {
      recall_subjects: MOCK_SUBJECTS,
      recall_sections: MOCK_SECTIONS,
      recall_chapters: MOCK_CHAPTERS,
      recall_cards: MOCK_CARDS,
      recall_progress: Object.entries(MOCK_PASSES).map(([chapter_id, pass]) => ({
        chapter_id,
        pass,
        user_id: MOCK_USER.id,
      })),
    };
    return makeQueryBuilder(tableData[table] ?? []);
  },
};
