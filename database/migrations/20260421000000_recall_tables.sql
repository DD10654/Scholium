-- ── recall_chapters ────────────────────────────────────────────────────────────
-- Static content: subjects → sections → chapters. No user may insert/update/delete.
CREATE TABLE public.recall_chapters (
  id          TEXT PRIMARY KEY,                      -- e.g. 'ph-kinematics'
  subject_id  TEXT NOT NULL,                         -- 'physics' | 'economics'
  subject_name TEXT NOT NULL,
  subject_emoji TEXT NOT NULL,
  section_id  TEXT NOT NULL,                         -- e.g. 'ph-mechanics'
  section_name TEXT NOT NULL,
  name        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ── recall_cards ───────────────────────────────────────────────────────────────
-- Static content: term/definition pairs. No user may insert/update/delete.
CREATE TABLE public.recall_cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  TEXT NOT NULL REFERENCES public.recall_chapters(id) ON DELETE CASCADE,
  term        TEXT NOT NULL,
  definition  TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_recall_cards_chapter_id ON public.recall_cards(chapter_id);

-- ── recall_progress ────────────────────────────────────────────────────────────
-- Per-user pass level (1-4) for each chapter. Users own their own rows.
CREATE TABLE public.recall_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id  TEXT NOT NULL REFERENCES public.recall_chapters(id) ON DELETE CASCADE,
  pass        INTEGER NOT NULL DEFAULT 1 CHECK (pass BETWEEN 1 AND 4),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

CREATE INDEX idx_recall_progress_user_id ON public.recall_progress(user_id);

-- Define locally in case this migration runs before the base migration
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_recall_progress_updated_at
  BEFORE UPDATE ON public.recall_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── RLS ────────────────────────────────────────────────────────────────────────
ALTER TABLE public.recall_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_cards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_progress ENABLE ROW LEVEL SECURITY;

-- Chapters: anyone can read, nobody can write via API
CREATE POLICY "recall_chapters: public read"
  ON public.recall_chapters FOR SELECT USING (true);

-- Cards: anyone can read, nobody can write via API
CREATE POLICY "recall_cards: public read"
  ON public.recall_cards FOR SELECT USING (true);

-- Progress: each user owns their own rows
CREATE POLICY "recall_progress: user select"
  ON public.recall_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "recall_progress: user insert"
  ON public.recall_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recall_progress: user update"
  ON public.recall_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "recall_progress: user delete"
  ON public.recall_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ── SEED: chapters ─────────────────────────────────────────────────────────────
INSERT INTO public.recall_chapters (id, subject_id, subject_name, subject_emoji, section_id, section_name, name, sort_order) VALUES
  ('ph-kinematics',        'physics',    'Physics',    '⚛️', 'ph-mechanics',  'Mechanics',               'Kinematics',               1),
  ('ph-newtons-laws',      'physics',    'Physics',    '⚛️', 'ph-mechanics',  'Mechanics',               'Newton''s Laws',            2),
  ('ph-energy',            'physics',    'Physics',    '⚛️', 'ph-mechanics',  'Mechanics',               'Energy & Work',             3),
  ('ph-wave-properties',   'physics',    'Physics',    '⚛️', 'ph-waves',      'Waves & Optics',          'Wave Properties',           4),
  ('ph-light',             'physics',    'Physics',    '⚛️', 'ph-waves',      'Waves & Optics',          'Light & Optics',            5),
  ('ph-heat',              'physics',    'Physics',    '⚛️', 'ph-thermo',     'Thermodynamics',          'Heat & Temperature',        6),
  ('ph-thermo-laws',       'physics',    'Physics',    '⚛️', 'ph-thermo',     'Thermodynamics',          'Laws of Thermodynamics',    7),
  ('ph-circuits',          'physics',    'Physics',    '⚛️', 'ph-em',         'Electricity & Magnetism', 'Electric Circuits',         8),
  ('ph-magnetism',         'physics',    'Physics',    '⚛️', 'ph-em',         'Electricity & Magnetism', 'Magnetism & Induction',     9),
  ('ph-quantum',           'physics',    'Physics',    '⚛️', 'ph-modern',     'Modern Physics',          'Quantum Mechanics',        10),
  ('ph-relativity',        'physics',    'Physics',    '⚛️', 'ph-modern',     'Modern Physics',          'Special Relativity',       11),
  ('ph-nuclear-structure', 'physics',    'Physics',    '⚛️', 'ph-nuclear',    'Nuclear Physics',         'Nuclear Structure',        12),
  ('ph-radioactivity',     'physics',    'Physics',    '⚛️', 'ph-nuclear',    'Nuclear Physics',         'Radioactivity',            13),
  ('eco-basic-concepts',   'economics',  'Economics',  '📈', 'eco-micro-foundations', 'Microeconomic Foundations', 'Basic Concepts',  1),
  ('eco-consumer-theory',  'economics',  'Economics',  '📈', 'eco-micro-foundations', 'Microeconomic Foundations', 'Consumer Theory', 2),
  ('eco-demand',           'economics',  'Economics',  '📈', 'eco-supply-demand', 'Supply & Demand',     'Demand',                   3),
  ('eco-supply',           'economics',  'Economics',  '📈', 'eco-supply-demand', 'Supply & Demand',     'Supply',                   4),
  ('eco-perfect-competition','economics','Economics',  '📈', 'eco-market-structures', 'Market Structures','Perfect Competition',      5),
  ('eco-monopoly',         'economics',  'Economics',  '📈', 'eco-market-structures', 'Market Structures','Monopoly',                 6),
  ('eco-national-income',  'economics',  'Economics',  '📈', 'eco-macro',     'Macroeconomics',          'National Income',           7),
  ('eco-fiscal-policy',    'economics',  'Economics',  '📈', 'eco-macro',     'Macroeconomics',          'Fiscal & Monetary Policy',  8),
  ('eco-trade-theory',     'economics',  'Economics',  '📈', 'eco-international', 'International Trade', 'Trade Theory',              9),
  ('eco-exchange-rates',   'economics',  'Economics',  '📈', 'eco-international', 'International Trade', 'Exchange Rates',           10),
  ('eco-money-banking',    'economics',  'Economics',  '📈', 'eco-financial',  'Financial Markets',      'Money & Banking',          11),
  ('eco-investment',       'economics',  'Economics',  '📈', 'eco-financial',  'Financial Markets',      'Investment & Assets',      12);

-- ── SEED: cards ────────────────────────────────────────────────────────────────
INSERT INTO public.recall_cards (chapter_id, term, definition, sort_order) VALUES
  -- ph-kinematics
  ('ph-kinematics','Displacement','The change in position of an object from its initial to final location; a vector quantity measured in metres.',1),
  ('ph-kinematics','Velocity','The rate of change of displacement with respect to time; a vector quantity measured in m/s.',2),
  ('ph-kinematics','Acceleration','The rate of change of velocity with respect to time; a vector quantity measured in m/s².',3),
  ('ph-kinematics','Free Fall','Motion under gravity alone with no air resistance, producing a constant downward acceleration of approximately 9.8 m/s².',4),
  ('ph-kinematics','Projectile','An object launched into the air that moves under the influence of gravity alone after launch, following a parabolic path.',5),
  ('ph-kinematics','Uniform Motion','Motion at a constant velocity with zero acceleration and equal displacement in equal time intervals.',6),
  ('ph-kinematics','Instantaneous Velocity','The velocity of an object at a specific moment in time, found as the derivative of position with respect to time.',7),
  ('ph-kinematics','Scalar','A physical quantity that has magnitude only, with no directional component, such as speed, mass, or temperature.',8),
  -- ph-newtons-laws
  ('ph-newtons-laws','Inertia','The tendency of an object to resist changes to its state of rest or uniform motion in a straight line.',1),
  ('ph-newtons-laws','Newton''s First Law','An object remains at rest or in uniform motion unless acted upon by a net external force.',2),
  ('ph-newtons-laws','Newton''s Second Law','The net force on an object equals the product of its mass and acceleration (F = ma).',3),
  ('ph-newtons-laws','Newton''s Third Law','For every action force there is an equal and opposite reaction force acting on a different object.',4),
  ('ph-newtons-laws','Normal Force','The perpendicular contact force exerted by a surface on an object resting on or pressing against it.',5),
  ('ph-newtons-laws','Friction','A contact force that opposes relative motion between two surfaces; can be static or kinetic.',6),
  ('ph-newtons-laws','Tension','The pulling force transmitted through a string, rope, or cable when pulled taut at both ends.',7),
  ('ph-newtons-laws','Net Force','The vector sum of all forces acting on an object; determines the magnitude and direction of acceleration.',8),
  -- ph-energy
  ('ph-energy','Work','The product of force and displacement in the direction of the force; measured in joules (J). W = Fd cosθ.',1),
  ('ph-energy','Kinetic Energy','The energy an object possesses due to its motion; equal to ½mv², where m is mass and v is speed.',2),
  ('ph-energy','Gravitational Potential Energy','The energy stored in an object due to its height above a reference level; equal to mgh.',3),
  ('ph-energy','Conservation of Energy','The principle that total mechanical energy of an isolated system remains constant; energy cannot be created or destroyed.',4),
  ('ph-energy','Power','The rate at which work is done or energy is transferred; measured in watts (W). P = W/t.',5),
  ('ph-energy','Efficiency','The ratio of useful output energy to total input energy, expressed as a percentage. η = (useful output / total input) × 100.',6),
  ('ph-energy','Elastic Potential Energy','The energy stored in a deformed elastic object such as a compressed spring; equal to ½kx².',7),
  ('ph-energy','Mechanical Energy','The sum of an object''s kinetic energy and all forms of potential energy; conserved in the absence of friction.',8),
  -- ph-wave-properties
  ('ph-wave-properties','Wavelength','The distance between two consecutive points in phase on a wave, such as crest to crest; symbol λ, measured in metres.',1),
  ('ph-wave-properties','Frequency','The number of complete wave cycles passing a fixed point per second; measured in hertz (Hz).',2),
  ('ph-wave-properties','Amplitude','The maximum displacement of a wave from its equilibrium (rest) position; related to the energy carried by the wave.',3),
  ('ph-wave-properties','Transverse Wave','A wave in which the oscillations of particles are perpendicular to the direction of wave propagation, e.g. light.',4),
  ('ph-wave-properties','Longitudinal Wave','A wave in which the oscillations of particles are parallel to the direction of wave propagation, e.g. sound.',5),
  ('ph-wave-properties','Superposition','The principle that when two waves overlap, the resultant displacement equals the algebraic sum of the individual displacements.',6),
  ('ph-wave-properties','Resonance','The phenomenon where a system vibrates at maximum amplitude when driven at or near its natural frequency.',7),
  ('ph-wave-properties','Wave Speed','The speed at which a wave pattern travels through a medium; equal to the product of frequency and wavelength (v = fλ).',8),
  -- ph-light
  ('ph-light','Refraction','The bending of a wave as it passes from one medium to another due to a change in wave speed.',1),
  ('ph-light','Reflection','The bouncing of a wave off a surface; the angle of incidence equals the angle of reflection.',2),
  ('ph-light','Total Internal Reflection','Complete reflection of light back into a denser medium when the angle of incidence exceeds the critical angle.',3),
  ('ph-light','Critical Angle','The angle of incidence in a denser medium at which refraction produces an angle of 90°; beyond this, total internal reflection occurs.',4),
  ('ph-light','Snell''s Law','The relationship n₁sinθ₁ = n₂sinθ₂ describing how light bends at the boundary between two media with different refractive indices.',5),
  ('ph-light','Diffraction','The spreading of waves around corners or through openings; most significant when the gap size is similar to the wavelength.',6),
  ('ph-light','Refractive Index','The ratio of the speed of light in a vacuum to its speed in a given medium; n = c/v. A dimensionless quantity greater than 1.',7),
  ('ph-light','Electromagnetic Spectrum','The range of all electromagnetic radiation ordered by frequency or wavelength, from radio waves through to gamma rays.',8),
  -- ph-heat
  ('ph-heat','Temperature','A measure of the average kinetic energy of particles in a substance; measured in kelvin (K) or degrees Celsius (°C).',1),
  ('ph-heat','Thermal Equilibrium','The state reached when two objects in contact have the same temperature and there is no net flow of heat between them.',2),
  ('ph-heat','Specific Heat Capacity','The energy required to raise the temperature of 1 kg of a substance by 1 K; symbol c, units J kg⁻¹ K⁻¹.',3),
  ('ph-heat','Latent Heat','The energy absorbed or released during a phase change (e.g. melting or boiling) without any change in temperature.',4),
  ('ph-heat','Conduction','The transfer of thermal energy through a material via direct particle-to-particle interaction without bulk movement.',5),
  ('ph-heat','Convection','The transfer of thermal energy via bulk movement of a fluid caused by density differences due to temperature gradients.',6),
  ('ph-heat','Radiation','The transfer of energy by electromagnetic waves (mainly infrared); requires no medium and occurs even through a vacuum.',7),
  ('ph-heat','Absolute Zero','The lowest possible temperature, 0 K (−273.15°C), at which particles have the minimum possible kinetic energy.',8),
  -- ph-thermo-laws
  ('ph-thermo-laws','First Law of Thermodynamics','Energy cannot be created or destroyed; the change in internal energy equals heat added to the system minus work done by the system.',1),
  ('ph-thermo-laws','Second Law of Thermodynamics','Heat flows spontaneously from hot to cold bodies; the entropy of an isolated system always increases or remains constant.',2),
  ('ph-thermo-laws','Entropy','A measure of the disorder or randomness of a system; increases in all spontaneous irreversible processes.',3),
  ('ph-thermo-laws','Internal Energy','The total kinetic and potential energy of all the particles within a thermodynamic system.',4),
  ('ph-thermo-laws','Isothermal Process','A thermodynamic process occurring at constant temperature; for an ideal gas, internal energy does not change.',5),
  ('ph-thermo-laws','Adiabatic Process','A thermodynamic process in which no heat is exchanged with the surroundings (Q = 0); temperature changes via work alone.',6),
  ('ph-thermo-laws','Heat Engine','A device that converts thermal energy into mechanical work by transferring heat from a hot reservoir to a cold reservoir.',7),
  ('ph-thermo-laws','Thermodynamic System','A defined region of space or quantity of matter under study; classified as open, closed, or isolated based on energy/matter exchange.',8),
  -- ph-circuits
  ('ph-circuits','Current','The rate of flow of electric charge past a point in a circuit; measured in amperes (A). I = Q/t.',1),
  ('ph-circuits','Resistance','The opposition to the flow of electric current in a conductor; measured in ohms (Ω).',2),
  ('ph-circuits','Ohm''s Law','The current through a conductor is directly proportional to the voltage across it at constant temperature; V = IR.',3),
  ('ph-circuits','Electromotive Force','The energy transferred per unit charge by a source of electrical energy such as a battery; measured in volts (V).',4),
  ('ph-circuits','Kirchhoff''s Current Law','The sum of currents entering a node equals the sum of currents leaving it; based on conservation of charge.',5),
  ('ph-circuits','Kirchhoff''s Voltage Law','The sum of all voltages around any closed loop in a circuit equals zero; based on conservation of energy.',6),
  ('ph-circuits','Series Circuit','A circuit in which components are connected end-to-end in a single loop; the same current flows through all components.',7),
  ('ph-circuits','Parallel Circuit','A circuit in which components share the same two terminal nodes; the same voltage appears across all branches.',8),
  -- ph-magnetism
  ('ph-magnetism','Magnetic Field','A region of space where a magnetic force acts on moving charges or magnetic materials; measured in tesla (T).',1),
  ('ph-magnetism','Magnetic Flux','The total magnetic field passing perpendicularly through a surface; Φ = BA; measured in webers (Wb).',2),
  ('ph-magnetism','Faraday''s Law','The induced EMF in a circuit is equal to the negative rate of change of magnetic flux linkage through the circuit.',3),
  ('ph-magnetism','Lenz''s Law','The direction of an induced current is always such that it opposes the change in magnetic flux that produced it.',4),
  ('ph-magnetism','Electromagnetic Induction','The production of an EMF in a conductor due to a changing magnetic flux; the basis of generators and transformers.',5),
  ('ph-magnetism','Motor Effect','The force experienced by a current-carrying conductor placed in an external magnetic field; F = BIL sinθ.',6),
  ('ph-magnetism','Transformer','A device using electromagnetic induction to change AC voltage between two coil windings on a shared iron core.',7),
  ('ph-magnetism','Solenoid','A coil of wire carrying current that produces a uniform magnetic field inside it, behaving like a bar magnet externally.',8),
  -- ph-quantum
  ('ph-quantum','Photon','A discrete quantum of electromagnetic energy with energy E = hf, where h is Planck''s constant and f is frequency.',1),
  ('ph-quantum','Photoelectric Effect','The emission of electrons from a metal surface when light above a threshold frequency shines on it; cannot be explained classically.',2),
  ('ph-quantum','Wave-Particle Duality','The principle that quantum objects exhibit both wave-like and particle-like properties depending on the experiment performed.',3),
  ('ph-quantum','de Broglie Wavelength','The wavelength associated with a moving particle; λ = h/p, where p is the particle''s momentum. Significant only at atomic scales.',4),
  ('ph-quantum','Heisenberg Uncertainty Principle','It is impossible to simultaneously know the exact position and exact momentum of a particle; Δx·Δp ≥ ħ/2.',5),
  ('ph-quantum','Energy Level','A discrete, quantised value of energy that an electron can occupy within an atom; electrons absorb or emit photons when transitioning.',6),
  ('ph-quantum','Emission Spectrum','The set of discrete frequencies of light emitted by excited atoms when electrons drop from higher to lower energy levels.',7),
  ('ph-quantum','Planck''s Constant','A fundamental physical constant h ≈ 6.63 × 10⁻³⁴ J·s relating the energy of a photon to its frequency; E = hf.',8),
  -- ph-relativity
  ('ph-relativity','Special Relativity','Einstein''s theory stating that the laws of physics are identical in all inertial frames and the speed of light is constant for all observers.',1),
  ('ph-relativity','Time Dilation','The slowing of time experienced by an observer in relative motion compared to a stationary one; t′ = γt₀.',2),
  ('ph-relativity','Length Contraction','The shortening of an object''s measured length in the direction of motion for a relativistic observer; L′ = L₀/γ.',3),
  ('ph-relativity','Rest Mass Energy','The energy equivalent of an object''s rest mass, even when stationary; given by Einstein''s famous equation E₀ = mc².',4),
  ('ph-relativity','Lorentz Factor','The factor γ = 1/√(1 − v²/c²) that quantifies relativistic effects including time dilation and length contraction.',5),
  ('ph-relativity','Mass-Energy Equivalence','The principle that mass and energy are two forms of the same thing, interconvertible via E = mc².',6),
  ('ph-relativity','Inertial Reference Frame','A frame of reference that is not accelerating; Newton''s first law holds and the laws of physics take their simplest form.',7),
  ('ph-relativity','Relativistic Momentum','The momentum of a fast-moving object corrected by the Lorentz factor: p = γmv; it approaches infinity as v → c.',8),
  -- ph-nuclear-structure
  ('ph-nuclear-structure','Nucleus','The dense central region of an atom containing protons and neutrons; contains nearly all the atomic mass in a tiny volume.',1),
  ('ph-nuclear-structure','Atomic Number','The number of protons in the nucleus of an atom, denoted Z; uniquely identifies the chemical element.',2),
  ('ph-nuclear-structure','Mass Number','The total number of protons and neutrons (nucleons) in the nucleus of an atom; denoted A.',3),
  ('ph-nuclear-structure','Isotope','Atoms of the same element that have the same number of protons but different numbers of neutrons in their nuclei.',4),
  ('ph-nuclear-structure','Nuclear Binding Energy','The energy required to completely separate all nucleons in a nucleus; released when a nucleus assembles from its constituent nucleons.',5),
  ('ph-nuclear-structure','Strong Nuclear Force','The short-range fundamental force that holds nucleons together in the nucleus; much stronger than electrostatic repulsion at close range.',6),
  ('ph-nuclear-structure','Nucleon','A particle found in the nucleus of an atom; either a proton (positive charge) or a neutron (no charge).',7),
  ('ph-nuclear-structure','Mass Defect','The difference between the total mass of separate nucleons and the measured mass of the assembled nucleus; equivalent to binding energy via E = mc².',8),
  -- ph-radioactivity
  ('ph-radioactivity','Radioactive Decay','The spontaneous disintegration of an unstable nucleus, emitting radiation in the form of alpha, beta, or gamma radiation.',1),
  ('ph-radioactivity','Alpha Decay','Emission of an alpha particle (2 protons + 2 neutrons) from an unstable nucleus, reducing mass number by 4 and atomic number by 2.',2),
  ('ph-radioactivity','Beta Decay','Emission of an electron (β⁻) or positron (β⁺) from a nucleus as a neutron converts to a proton or vice versa.',3),
  ('ph-radioactivity','Gamma Radiation','High-energy electromagnetic radiation emitted from a nucleus transitioning to a lower energy state; has no mass or charge.',4),
  ('ph-radioactivity','Half-Life','The time required for half the radioactive nuclei in a sample to decay; a constant characteristic of each isotope.',5),
  ('ph-radioactivity','Activity','The number of radioactive decays per second in a sample; measured in becquerels (Bq). A = λN.',6),
  ('ph-radioactivity','Nuclear Fission','The splitting of a heavy nucleus into smaller fragments, releasing large amounts of energy; the process used in nuclear reactors.',7),
  ('ph-radioactivity','Nuclear Fusion','The joining of light nuclei to form a heavier nucleus, releasing energy; the process that powers stars including the Sun.',8),
  -- eco-basic-concepts
  ('eco-basic-concepts','Scarcity','The fundamental economic problem that resources are limited relative to unlimited human wants and needs; forces choices.',1),
  ('eco-basic-concepts','Opportunity Cost','The value of the next best alternative forgone when making a choice between competing uses of scarce resources.',2),
  ('eco-basic-concepts','Ceteris Paribus','A Latin phrase meaning "all other things being equal"; used to isolate the effect of one variable while holding others constant.',3),
  ('eco-basic-concepts','Marginal Analysis','Decision-making by comparing the additional (marginal) benefit and marginal cost of a small change in an activity.',4),
  ('eco-basic-concepts','Factors of Production','The inputs used to produce goods and services: land, labour, capital, and entrepreneurship.',5),
  ('eco-basic-concepts','Positive Economics','Objective, factual statements about economic phenomena that can be tested against real-world evidence.',6),
  ('eco-basic-concepts','Normative Economics','Value-based statements about how the economy should operate; involves subjective judgements about desirability.',7),
  ('eco-basic-concepts','Economic Efficiency','The allocation of resources that maximises total social welfare; no reallocation can make someone better off without making another worse off.',8),
  -- eco-consumer-theory
  ('eco-consumer-theory','Utility','The satisfaction or benefit derived by a consumer from consuming a good or service; the basis of consumer decision-making.',1),
  ('eco-consumer-theory','Marginal Utility','The additional satisfaction gained from consuming one extra unit of a good or service, holding all else constant.',2),
  ('eco-consumer-theory','Diminishing Marginal Utility','The principle that as consumption of a good increases, each additional unit yields less satisfaction than the previous one.',3),
  ('eco-consumer-theory','Consumer Surplus','The difference between the maximum a consumer is willing to pay for a good and the actual market price paid.',4),
  ('eco-consumer-theory','Indifference Curve','A curve showing all combinations of two goods that provide a consumer with exactly the same total level of utility.',5),
  ('eco-consumer-theory','Normal Good','A good for which demand increases as consumer income rises, ceteris paribus; has a positive income elasticity of demand.',6),
  ('eco-consumer-theory','Inferior Good','A good for which demand decreases as consumer income rises; has a negative income elasticity of demand.',7),
  ('eco-consumer-theory','Budget Constraint','The set of all combinations of goods a consumer can afford given their income and the prices of goods.',8),
  -- eco-demand
  ('eco-demand','Law of Demand','As the price of a good rises (falls), the quantity demanded falls (rises), ceteris paribus; an inverse relationship.',1),
  ('eco-demand','Price Elasticity of Demand','A measure of the responsiveness of quantity demanded to a change in price; PED = %ΔQd ÷ %ΔP.',2),
  ('eco-demand','Income Elasticity of Demand','A measure of how quantity demanded responds to a change in consumer income; YED = %ΔQd ÷ %ΔY.',3),
  ('eco-demand','Cross Elasticity of Demand','A measure of how demand for one good responds to a price change in another good; XED = %ΔQd(A) ÷ %ΔP(B).',4),
  ('eco-demand','Substitute Good','A good that can replace another in consumption; a rise in the price of one leads to increased demand for the other (positive XED).',5),
  ('eco-demand','Complementary Good','A good used together with another; a rise in the price of one leads to a fall in demand for the other (negative XED).',6),
  ('eco-demand','Giffen Good','A highly inferior good for which demand increases as price rises, violating the law of demand; extremely rare in practice.',7),
  ('eco-demand','Effective Demand','Demand backed by both the desire and the ability (purchasing power) to pay for a good or service at a given price.',8),
  -- eco-supply
  ('eco-supply','Law of Supply','As the price of a good rises (falls), the quantity supplied rises (falls), ceteris paribus; a positive relationship.',1),
  ('eco-supply','Price Elasticity of Supply','A measure of the responsiveness of quantity supplied to a change in price; PES = %ΔQs ÷ %ΔP.',2),
  ('eco-supply','Producer Surplus','The difference between the price a producer receives for a good and the minimum price they would accept (marginal cost).',3),
  ('eco-supply','Subsidy','A payment by the government to producers to reduce their costs; shifts the supply curve downward (rightward), lowering equilibrium price.',4),
  ('eco-supply','Indirect Tax','A tax levied on the sale of goods and services, increasing producers'' costs; shifts supply curve upward (leftward), raising equilibrium price.',5),
  ('eco-supply','Economies of Scale','The reduction in long-run average cost that occurs as a firm increases its scale of production.',6),
  ('eco-supply','Diseconomies of Scale','The increase in long-run average cost that occurs when a firm grows beyond its optimal size.',7),
  ('eco-supply','Joint Supply','A situation where producing more of one good automatically leads to greater production of another, e.g. beef and leather.',8),
  -- eco-perfect-competition
  ('eco-perfect-competition','Perfect Competition','A market structure with many firms, homogeneous products, free entry and exit, and perfect information; all firms are price takers.',1),
  ('eco-perfect-competition','Price Taker','A firm with no market power that must accept the market-determined price; faces a perfectly elastic demand curve.',2),
  ('eco-perfect-competition','Allocative Efficiency','Achieved when price equals marginal cost (P = MC), ensuring resources are allocated to maximise total social welfare.',3),
  ('eco-perfect-competition','Productive Efficiency','Achieved when firms produce at the minimum point on the long-run average cost curve (P = min AC).',4),
  ('eco-perfect-competition','Normal Profit','The minimum return required to keep a firm operating in an industry; total revenue just covers total economic costs.',5),
  ('eco-perfect-competition','Supernormal Profit','Revenue in excess of all costs including normal profit; signals entry of new firms in a competitive market.',6),
  ('eco-perfect-competition','Long-run Equilibrium','In perfect competition, the position where P = MC = minimum AC and all firms earn only normal profit.',7),
  ('eco-perfect-competition','Marginal Cost','The additional cost incurred from producing one extra unit of output; firms maximise profit where MC = MR.',8),
  -- eco-monopoly
  ('eco-monopoly','Monopoly','A market structure with a single dominant supplier, high barriers to entry, and the power to set price above marginal cost.',1),
  ('eco-monopoly','Price Maker','A firm with market power that can set its own price by choosing a quantity along its downward-sloping demand curve.',2),
  ('eco-monopoly','Barriers to Entry','Obstacles preventing new firms from entering a market, protecting incumbents'' profits; e.g. patents, high capital costs.',3),
  ('eco-monopoly','Natural Monopoly','A monopoly arising because economies of scale are so large that one firm can supply the entire market at lower cost than multiple firms.',4),
  ('eco-monopoly','Price Discrimination','Charging different prices to different consumers for the same product based on their differing willingness to pay.',5),
  ('eco-monopoly','X-Inefficiency','The tendency of monopolists to have higher costs than necessary due to a lack of competitive pressure to minimise costs.',6),
  ('eco-monopoly','Deadweight Welfare Loss','The reduction in total surplus caused by a monopolist producing below the socially optimal quantity and charging above MC.',7),
  ('eco-monopoly','Lerner Index','A measure of monopoly power equal to (P − MC) / P; ranges from 0 (perfect competition) to 1 (pure monopoly).',8),
  -- eco-national-income
  ('eco-national-income','Gross Domestic Product','The total monetary value of all final goods and services produced within a country''s borders in a given time period.',1),
  ('eco-national-income','Aggregate Demand','The total planned expenditure on goods and services in an economy at a given price level; AD = C + I + G + (X − M).',2),
  ('eco-national-income','Aggregate Supply','The total output that all producers in an economy are willing and able to supply at each price level.',3),
  ('eco-national-income','Multiplier Effect','The process by which an initial injection of spending leads to a proportionally larger increase in national income.',4),
  ('eco-national-income','Circular Flow of Income','A model showing the continuous flow of money between households, firms, government, banks, and the foreign sector.',5),
  ('eco-national-income','Injection','Spending that enters the circular flow from outside the household-firm loop: investment (I), government spending (G), and exports (X).',6),
  ('eco-national-income','Withdrawal','Income that leaks out of the circular flow without being spent on domestic output: saving (S), taxation (T), and imports (M).',7),
  ('eco-national-income','Real GDP','GDP adjusted for inflation using a base-year price level; measures actual changes in output rather than price changes.',8),
  -- eco-fiscal-policy
  ('eco-fiscal-policy','Fiscal Policy','The use of government spending and taxation to influence aggregate demand, economic growth, and income distribution.',1),
  ('eco-fiscal-policy','Monetary Policy','The use of interest rates and money supply by a central bank to control inflation and influence aggregate demand.',2),
  ('eco-fiscal-policy','Expansionary Policy','Fiscal or monetary measures aimed at increasing aggregate demand; e.g. cutting taxes, raising spending, or lowering interest rates.',3),
  ('eco-fiscal-policy','Contractionary Policy','Fiscal or monetary measures aimed at reducing aggregate demand to control inflation; e.g. raising taxes or interest rates.',4),
  ('eco-fiscal-policy','Quantitative Easing','A monetary policy tool where a central bank creates new money to purchase assets, expanding the money supply when rates near zero.',5),
  ('eco-fiscal-policy','Automatic Stabilisers','Tax and spending mechanisms (e.g. unemployment benefits) that automatically reduce the impact of economic fluctuations.',6),
  ('eco-fiscal-policy','Budget Deficit','When government expenditure exceeds tax revenue in a given period; financed by borrowing, adding to the national debt.',7),
  ('eco-fiscal-policy','Crowding Out','The reduction in private investment caused by increased government borrowing, which raises real interest rates in the economy.',8),
  -- eco-trade-theory
  ('eco-trade-theory','Absolute Advantage','The ability of a country to produce a good using fewer resources (lower input cost) than another country.',1),
  ('eco-trade-theory','Comparative Advantage','The ability of a country to produce a good at a lower opportunity cost than another country; the basis for mutually beneficial trade.',2),
  ('eco-trade-theory','Terms of Trade','The ratio of a country''s average export prices to its average import prices; determines the gains from international trade.',3),
  ('eco-trade-theory','Protectionism','Government policies restricting international trade to shield domestic industries from foreign competition; e.g. tariffs and quotas.',4),
  ('eco-trade-theory','Tariff','A tax imposed on imported goods, raising their domestic price and protecting home producers from cheaper foreign competition.',5),
  ('eco-trade-theory','Import Quota','A physical limit on the quantity of a specific good that can be imported into a country over a given period.',6),
  ('eco-trade-theory','Free Trade','International trade without government-imposed barriers; enables countries to specialise based on comparative advantage.',7),
  ('eco-trade-theory','Balance of Trade','The difference between the value of a country''s exports and imports of goods; a component of the current account.',8),
  -- eco-exchange-rates
  ('eco-exchange-rates','Exchange Rate','The price of one currency expressed in terms of another; determined by supply and demand in the foreign exchange market.',1),
  ('eco-exchange-rates','Appreciation','An increase in the value of a currency relative to others in a floating exchange rate system; makes exports more expensive.',2),
  ('eco-exchange-rates','Depreciation','A decrease in the value of a currency relative to others; makes exports cheaper and imports more expensive.',3),
  ('eco-exchange-rates','Floating Exchange Rate','A system where the exchange rate is determined freely by the market forces of supply and demand without government intervention.',4),
  ('eco-exchange-rates','Fixed Exchange Rate','A system where a currency''s value is officially pegged to another currency or commodity and maintained by government intervention.',5),
  ('eco-exchange-rates','Current Account','The part of the balance of payments recording trade in goods and services, primary income, and secondary income transfers.',6),
  ('eco-exchange-rates','Marshall-Lerner Condition','The condition for a currency depreciation to improve the current account: the sum of the price elasticities of exports and imports must exceed 1.',7),
  ('eco-exchange-rates','J-Curve Effect','The temporary worsening of the current account immediately after a depreciation before it improves, due to inelastic short-run trade responses.',8),
  -- eco-money-banking
  ('eco-money-banking','Commercial Bank','A financial institution that accepts customer deposits, makes loans, and creates credit through the process of fractional reserve banking.',1),
  ('eco-money-banking','Fractional Reserve Banking','The practice of banks holding only a fraction of deposits as reserves and lending out the remainder to earn interest.',2),
  ('eco-money-banking','Money Multiplier','The maximum amount the money supply can expand per unit of new reserves; equals 1 divided by the reserve ratio.',3),
  ('eco-money-banking','Liquidity','The ease and speed with which an asset can be converted into cash without a significant loss of value.',4),
  ('eco-money-banking','Credit Creation','The process by which commercial banks expand the broad money supply by making loans funded from deposited reserves.',5),
  ('eco-money-banking','Reserve Ratio','The proportion of customer deposits that a bank holds as liquid reserves rather than lending out; set by regulation or prudence.',6),
  ('eco-money-banking','Central Bank','The institution responsible for monetary policy, issuing currency, acting as lender of last resort, and maintaining financial stability.',7),
  ('eco-money-banking','Lender of Last Resort','The role of a central bank in providing emergency liquidity to solvent commercial banks facing short-term funding crises.',8),
  -- eco-investment
  ('eco-investment','Investment','Expenditure on capital goods such as machinery and buildings that increases the productive capacity of the economy.',1),
  ('eco-investment','Rate of Return','The profit or gain on an investment expressed as a percentage of the original cost; the key metric for investment decisions.',2),
  ('eco-investment','Risk','The possibility that the actual return on an investment will differ from the expected return; higher risk typically demands a higher return.',3),
  ('eco-investment','Diversification','The spreading of investment across different assets or sectors to reduce overall portfolio risk without sacrificing expected return.',4),
  ('eco-investment','Bond','A debt instrument issued by governments or firms that promises regular interest (coupon) payments and repayment of principal at maturity.',5),
  ('eco-investment','Equity','Ownership shares in a company; equity holders receive dividends and benefit from capital gains but bear residual risk.',6),
  ('eco-investment','Asset','Any resource with economic value that an individual, firm, or country owns and expects to generate future economic benefits.',7),
  ('eco-investment','Speculation','The purchase of assets with the hope of profiting from short-term price movements rather than from underlying income streams.',8);
