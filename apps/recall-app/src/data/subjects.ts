import type { Subject } from "@/types";

export const SUBJECTS: Subject[] = [
    {
      id: 'economics',
      name: 'Economics',
      emoji: '📈',
      accent: 'orange',
      sections: [
        {
          id: 'eco-micro-foundations',
          name: 'Microeconomic Foundations',
          chapters: [
            {
              id: 'eco-basic-concepts',
              name: 'Basic Concepts',
              cards: [
                { term: 'Scarcity', definition: 'The fundamental economic problem that resources are limited relative to unlimited human wants and needs; forces choices.' },
                { term: 'Opportunity Cost', definition: 'The value of the next best alternative forgone when making a choice between competing uses of scarce resources.' },
                { term: 'Ceteris Paribus', definition: 'A Latin phrase meaning "all other things being equal"; used to isolate the effect of one variable while holding others constant.' },
                { term: 'Marginal Analysis', definition: 'Decision-making by comparing the additional (marginal) benefit and marginal cost of a small change in an activity.' },
                { term: 'Factors of Production', definition: 'The inputs used to produce goods and services: land, labour, capital, and entrepreneurship.' },
                { term: 'Positive Economics', definition: 'Objective, factual statements about economic phenomena that can be tested against real-world evidence.' },
                { term: 'Normative Economics', definition: 'Value-based statements about how the economy should operate; involves subjective judgements about desirability.' },
                { term: 'Economic Efficiency', definition: 'The allocation of resources that maximises total social welfare; no reallocation can make someone better off without making another worse off.' },
              ]
            },
            {
              id: 'eco-consumer-theory',
              name: 'Consumer Theory',
              cards: [
                { term: 'Utility', definition: 'The satisfaction or benefit derived by a consumer from consuming a good or service; the basis of consumer decision-making.' },
                { term: 'Marginal Utility', definition: 'The additional satisfaction gained from consuming one extra unit of a good or service, holding all else constant.' },
                { term: 'Diminishing Marginal Utility', definition: 'The principle that as consumption of a good increases, each additional unit yields less satisfaction than the previous one.' },
                { term: 'Consumer Surplus', definition: 'The difference between the maximum a consumer is willing to pay for a good and the actual market price paid.' },
                { term: 'Indifference Curve', definition: 'A curve showing all combinations of two goods that provide a consumer with exactly the same total level of utility.' },
                { term: 'Normal Good', definition: 'A good for which demand increases as consumer income rises, ceteris paribus; has a positive income elasticity of demand.' },
                { term: 'Inferior Good', definition: 'A good for which demand decreases as consumer income rises; has a negative income elasticity of demand.' },
                { term: 'Budget Constraint', definition: 'The set of all combinations of goods a consumer can afford given their income and the prices of goods.' },
              ]
            }
          ]
        },
        {
          id: 'eco-supply-demand',
          name: 'Supply & Demand',
          chapters: [
            {
              id: 'eco-demand',
              name: 'Demand',
              cards: [
                { term: 'Law of Demand', definition: 'As the price of a good rises (falls), the quantity demanded falls (rises), ceteris paribus; an inverse relationship.' },
                { term: 'Price Elasticity of Demand', definition: 'A measure of the responsiveness of quantity demanded to a change in price; PED = %ΔQd ÷ %ΔP.' },
                { term: 'Income Elasticity of Demand', definition: 'A measure of how quantity demanded responds to a change in consumer income; YED = %ΔQd ÷ %ΔY.' },
                { term: 'Cross Elasticity of Demand', definition: 'A measure of how demand for one good responds to a price change in another good; XED = %ΔQd(A) ÷ %ΔP(B).' },
                { term: 'Substitute Good', definition: 'A good that can replace another in consumption; a rise in the price of one leads to increased demand for the other (positive XED).' },
                { term: 'Complementary Good', definition: 'A good used together with another; a rise in the price of one leads to a fall in demand for the other (negative XED).' },
                { term: 'Giffen Good', definition: 'A highly inferior good for which demand increases as price rises, violating the law of demand; extremely rare in practice.' },
                { term: 'Effective Demand', definition: 'Demand backed by both the desire and the ability (purchasing power) to pay for a good or service at a given price.' },
              ]
            },
            {
              id: 'eco-supply',
              name: 'Supply',
              cards: [
                { term: 'Law of Supply', definition: 'As the price of a good rises (falls), the quantity supplied rises (falls), ceteris paribus; a positive relationship.' },
                { term: 'Price Elasticity of Supply', definition: 'A measure of the responsiveness of quantity supplied to a change in price; PES = %ΔQs ÷ %ΔP.' },
                { term: 'Producer Surplus', definition: 'The difference between the price a producer receives for a good and the minimum price they would accept (marginal cost).' },
                { term: 'Subsidy', definition: 'A payment by the government to producers to reduce their costs; shifts the supply curve downward (rightward), lowering equilibrium price.' },
                { term: 'Indirect Tax', definition: 'A tax levied on the sale of goods and services, increasing producers\'s costs; shifts supply curve upward (leftward), raising equilibrium price.' },
                { term: 'Economies of Scale', definition: 'The reduction in long-run average cost that occurs as a firm increases its scale of production.' },
                { term: 'Diseconomies of Scale', definition: 'The increase in long-run average cost that occurs when a firm grows beyond its optimal size.' },
                { term: 'Joint Supply', definition: 'A situation where producing more of one good automatically leads to greater production of another, e.g. beef and leather.' },
              ]
            }
          ]
        },
        {
          id: 'eco-market-structures',
          name: 'Market Structures',
          chapters: [
            {
              id: 'eco-perfect-competition',
              name: 'Perfect Competition',
              cards: [
                { term: 'Perfect Competition', definition: 'A market structure with many firms, homogeneous products, free entry and exit, and perfect information; all firms are price takers.' },
                { term: 'Price Taker', definition: 'A firm with no market power that must accept the market-determined price; faces a perfectly elastic demand curve.' },
                { term: 'Allocative Efficiency', definition: 'Achieved when price equals marginal cost (P = MC), ensuring resources are allocated to maximise total social welfare.' },
                { term: 'Productive Efficiency', definition: 'Achieved when firms produce at the minimum point on the long-run average cost curve (P = min AC).' },
                { term: 'Normal Profit', definition: 'The minimum return required to keep a firm operating in an industry; total revenue just covers total economic costs.' },
                { term: 'Supernormal Profit', definition: 'Revenue in excess of all costs including normal profit; signals entry of new firms in a competitive market.' },
                { term: 'Long-run Equilibrium', definition: 'In perfect competition, the position where P = MC = minimum AC and all firms earn only normal profit.' },
                { term: 'Marginal Cost', definition: 'The additional cost incurred from producing one extra unit of output; firms maximise profit where MC = MR.' },
              ]
            },
            {
              id: 'eco-monopoly',
              name: 'Monopoly',
              cards: [
                { term: 'Monopoly', definition: 'A market structure with a single dominant supplier, high barriers to entry, and the power to set price above marginal cost.' },
                { term: 'Price Maker', definition: 'A firm with market power that can set its own price by choosing a quantity along its downward-sloping demand curve.' },
                { term: 'Barriers to Entry', definition: 'Obstacles preventing new firms from entering a market, protecting incumbents\'s profits; e.g. patents, high capital costs.' },
                { term: 'Natural Monopoly', definition: 'A monopoly arising because economies of scale are so large that one firm can supply the entire market at lower cost than multiple firms.' },
                { term: 'Price Discrimination', definition: 'Charging different prices to different consumers for the same product based on their differing willingness to pay.' },
                { term: 'X-Inefficiency', definition: 'The tendency of monopolists to have higher costs than necessary due to a lack of competitive pressure to minimise costs.' },
                { term: 'Deadweight Welfare Loss', definition: 'The reduction in total surplus caused by a monopolist producing below the socially optimal quantity and charging above MC.' },
                { term: 'Lerner Index', definition: 'A measure of monopoly power equal to (P − MC) / P; ranges from 0 (perfect competition) to 1 (pure monopoly).' },
              ]
            }
          ]
        },
        {
          id: 'eco-macro',
          name: 'Macroeconomics',
          chapters: [
            {
              id: 'eco-national-income',
              name: 'National Income',
              cards: [
                { term: 'Gross Domestic Product', definition: 'The total monetary value of all final goods and services produced within a country\'s borders in a given time period.' },
                { term: 'Aggregate Demand', definition: 'The total planned expenditure on goods and services in an economy at a given price level; AD = C + I + G + (X − M).' },
                { term: 'Aggregate Supply', definition: 'The total output that all producers in an economy are willing and able to supply at each price level.' },
                { term: 'Multiplier Effect', definition: 'The process by which an initial injection of spending leads to a proportionally larger increase in national income.' },
                { term: 'Circular Flow of Income', definition: 'A model showing the continuous flow of money between households, firms, government, banks, and the foreign sector.' },
                { term: 'Injection', definition: 'Spending that enters the circular flow from outside the household-firm loop: investment (I), government spending (G), and exports (X).' },
                { term: 'Withdrawal', definition: 'Income that leaks out of the circular flow without being spent on domestic output: saving (S), taxation (T), and imports (M).' },
                { term: 'Real GDP', definition: 'GDP adjusted for inflation using a base-year price level; measures actual changes in output rather than price changes.' },
              ]
            },
            {
              id: 'eco-fiscal-policy',
              name: 'Fiscal & Monetary Policy',
              cards: [
                { term: 'Fiscal Policy', definition: 'The use of government spending and taxation to influence aggregate demand, economic growth, and income distribution.' },
                { term: 'Monetary Policy', definition: 'The use of interest rates and money supply by a central bank to control inflation and influence aggregate demand.' },
                { term: 'Expansionary Policy', definition: 'Fiscal or monetary measures aimed at increasing aggregate demand; e.g. cutting taxes, raising spending, or lowering interest rates.' },
                { term: 'Contractionary Policy', definition: 'Fiscal or monetary measures aimed at reducing aggregate demand to control inflation; e.g. raising taxes or interest rates.' },
                { term: 'Quantitative Easing', definition: 'A monetary policy tool where a central bank creates new money to purchase assets, expanding the money supply when rates near zero.' },
                { term: 'Automatic Stabilisers', definition: 'Tax and spending mechanisms (e.g. unemployment benefits) that automatically reduce the impact of economic fluctuations.' },
                { term: 'Budget Deficit', definition: 'When government expenditure exceeds tax revenue in a given period; financed by borrowing, adding to the national debt.' },
                { term: 'Crowding Out', definition: 'The reduction in private investment caused by increased government borrowing, which raises real interest rates in the economy.' },
              ]
            }
          ]
        },
        {
          id: 'eco-international',
          name: 'International Trade',
          chapters: [
            {
              id: 'eco-trade-theory',
              name: 'Trade Theory',
              cards: [
                { term: 'Absolute Advantage', definition: 'The ability of a country to produce a good using fewer resources (lower input cost) than another country.' },
                { term: 'Comparative Advantage', definition: 'The ability of a country to produce a good at a lower opportunity cost than another country; the basis for mutually beneficial trade.' },
                { term: 'Terms of Trade', definition: 'The ratio of a country\'s average export prices to its average import prices; determines the gains from international trade.' },
                { term: 'Protectionism', definition: 'Government policies restricting international trade to shield domestic industries from foreign competition; e.g. tariffs and quotas.' },
                { term: 'Tariff', definition: 'A tax imposed on imported goods, raising their domestic price and protecting home producers from cheaper foreign competition.' },
                { term: 'Import Quota', definition: 'A physical limit on the quantity of a specific good that can be imported into a country over a given period.' },
                { term: 'Free Trade', definition: 'International trade without government-imposed barriers; enables countries to specialise based on comparative advantage.' },
                { term: 'Balance of Trade', definition: 'The difference between the value of a country\'s exports and imports of goods; a component of the current account.' },
              ]
            },
            {
              id: 'eco-exchange-rates',
              name: 'Exchange Rates',
              cards: [
                { term: 'Exchange Rate', definition: 'The price of one currency expressed in terms of another; determined by supply and demand in the foreign exchange market.' },
                { term: 'Appreciation', definition: 'An increase in the value of a currency relative to others in a floating exchange rate system; makes exports more expensive.' },
                { term: 'Depreciation', definition: 'A decrease in the value of a currency relative to others; makes exports cheaper and imports more expensive.' },
                { term: 'Floating Exchange Rate', definition: 'A system where the exchange rate is determined freely by the market forces of supply and demand without government intervention.' },
                { term: 'Fixed Exchange Rate', definition: 'A system where a currency\'s value is officially pegged to another currency or commodity and maintained by government intervention.' },
                { term: 'Current Account', definition: 'The part of the balance of payments recording trade in goods and services, primary income, and secondary income transfers.' },
                { term: 'Marshall-Lerner Condition', definition: 'The condition for a currency depreciation to improve the current account: the sum of the price elasticities of exports and imports must exceed 1.' },
                { term: 'J-Curve Effect', definition: 'The temporary worsening of the current account immediately after a depreciation before it improves, due to inelastic short-run trade responses.' },
              ]
            }
          ]
        },
        {
          id: 'eco-financial',
          name: 'Financial Markets',
          chapters: [
            {
              id: 'eco-money-banking',
              name: 'Money & Banking',
              cards: [
                { term: 'Commercial Bank', definition: 'A financial institution that accepts customer deposits, makes loans, and creates credit through the process of fractional reserve banking.' },
                { term: 'Fractional Reserve Banking', definition: 'The practice of banks holding only a fraction of deposits as reserves and lending out the remainder to earn interest.' },
                { term: 'Money Multiplier', definition: 'The maximum amount the money supply can expand per unit of new reserves; equals 1 divided by the reserve ratio.' },
                { term: 'Liquidity', definition: 'The ease and speed with which an asset can be converted into cash without a significant loss of value.' },
                { term: 'Credit Creation', definition: 'The process by which commercial banks expand the broad money supply by making loans funded from deposited reserves.' },
                { term: 'Reserve Ratio', definition: 'The proportion of customer deposits that a bank holds as liquid reserves rather than lending out; set by regulation or prudence.' },
                { term: 'Central Bank', definition: 'The institution responsible for monetary policy, issuing currency, acting as lender of last resort, and maintaining financial stability.' },
                { term: 'Lender of Last Resort', definition: 'The role of a central bank in providing emergency liquidity to solvent commercial banks facing short-term funding crises.' },
              ]
            },
            {
              id: 'eco-investment',
              name: 'Investment & Assets',
              cards: [
                { term: 'Investment', definition: 'Expenditure on capital goods such as machinery and buildings that increases the productive capacity of the economy.' },
                { term: 'Rate of Return', definition: 'The profit or gain on an investment expressed as a percentage of the original cost; the key metric for investment decisions.' },
                { term: 'Risk', definition: 'The possibility that the actual return on an investment will differ from the expected return; higher risk typically demands a higher return.' },
                { term: 'Diversification', definition: 'The spreading of investment across different assets or sectors to reduce overall portfolio risk without sacrificing expected return.' },
                { term: 'Bond', definition: 'A debt instrument issued by governments or firms that promises regular interest (coupon) payments and repayment of principal at maturity.' },
                { term: 'Equity', definition: 'Ownership shares in a company; equity holders receive dividends and benefit from capital gains but bear residual risk.' },
                { term: 'Asset', definition: 'Any resource with economic value that an individual, firm, or country owns and expects to generate future economic benefits.' },
                { term: 'Speculation', definition: 'The purchase of assets with the hope of profiting from short-term price movements rather than from underlying income streams.' },
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      accent: 'blue',
      sections: [
        {
          id: 'ph-mechanics',
          name: 'Mechanics',
          chapters: [
            {
              id: 'ph-kinematics',
              name: 'Kinematics',
              cards: [
                { term: 'Displacement', definition: 'The change in position of an object from its initial to final location; a vector quantity measured in metres.' },
                { term: 'Velocity', definition: 'The rate of change of displacement with respect to time; a vector quantity measured in m/s.' },
                { term: 'Acceleration', definition: 'The rate of change of velocity with respect to time; a vector quantity measured in m/s².' },
                { term: 'Free Fall', definition: 'Motion under gravity alone with no air resistance, producing a constant downward acceleration of approximately 9.8 m/s².' },
                { term: 'Projectile', definition: 'An object launched into the air that moves under the influence of gravity alone after launch, following a parabolic path.' },
                { term: 'Uniform Motion', definition: 'Motion at a constant velocity with zero acceleration and equal displacement in equal time intervals.' },
                { term: 'Instantaneous Velocity', definition: 'The velocity of an object at a specific moment in time, found as the derivative of position with respect to time.' },
                { term: 'Scalar', definition: 'A physical quantity that has magnitude only, with no directional component, such as speed, mass, or temperature.' },
              ]
            },
            {
              id: 'ph-newtons-laws',
              name: "Newton's Laws",
              cards: [
                { term: 'Inertia', definition: 'The tendency of an object to resist changes to its state of rest or uniform motion in a straight line.' },
                { term: "Newton's First Law", definition: 'An object remains at rest or in uniform motion unless acted upon by a net external force.' },
                { term: "Newton's Second Law", definition: 'The net force on an object equals the product of its mass and acceleration (F = ma).' },
                { term: "Newton's Third Law", definition: 'For every action force there is an equal and opposite reaction force acting on a different object.' },
                { term: 'Normal Force', definition: 'The perpendicular contact force exerted by a surface on an object resting on or pressing against it.' },
                { term: 'Friction', definition: 'A contact force that opposes relative motion between two surfaces; can be static or kinetic.' },
                { term: 'Tension', definition: 'The pulling force transmitted through a string, rope, or cable when pulled taut at both ends.' },
                { term: 'Net Force', definition: 'The vector sum of all forces acting on an object; determines the magnitude and direction of acceleration.' },
              ]
            },
            {
              id: 'ph-energy',
              name: 'Energy & Work',
              cards: [
                { term: 'Work', definition: 'The product of force and displacement in the direction of the force; measured in joules (J). W = Fd cosθ.' },
                { term: 'Kinetic Energy', definition: 'The energy an object possesses due to its motion; equal to ½mv², where m is mass and v is speed.' },
                { term: 'Gravitational Potential Energy', definition: 'The energy stored in an object due to its height above a reference level; equal to mgh.' },
                { term: 'Conservation of Energy', definition: 'The principle that total mechanical energy of an isolated system remains constant; energy cannot be created or destroyed.' },
                { term: 'Power', definition: 'The rate at which work is done or energy is transferred; measured in watts (W). P = W/t.' },
                { term: 'Efficiency', definition: 'The ratio of useful output energy to total input energy, expressed as a percentage. η = (useful output / total input) × 100.' },
                { term: 'Elastic Potential Energy', definition: 'The energy stored in a deformed elastic object such as a compressed spring; equal to ½kx².' },
                { term: 'Mechanical Energy', definition: 'The sum of an object\'s kinetic energy and all forms of potential energy; conserved in the absence of friction.' },
              ]
            }
          ]
        },
        {
          id: 'ph-waves',
          name: 'Waves & Optics',
          chapters: [
            {
              id: 'ph-wave-properties',
              name: 'Wave Properties',
              cards: [
                { term: 'Wavelength', definition: 'The distance between two consecutive points in phase on a wave, such as crest to crest; symbol λ, measured in metres.' },
                { term: 'Frequency', definition: 'The number of complete wave cycles passing a fixed point per second; measured in hertz (Hz).' },
                { term: 'Amplitude', definition: 'The maximum displacement of a wave from its equilibrium (rest) position; related to the energy carried by the wave.' },
                { term: 'Transverse Wave', definition: 'A wave in which the oscillations of particles are perpendicular to the direction of wave propagation, e.g. light.' },
                { term: 'Longitudinal Wave', definition: 'A wave in which the oscillations of particles are parallel to the direction of wave propagation, e.g. sound.' },
                { term: 'Superposition', definition: 'The principle that when two waves overlap, the resultant displacement equals the algebraic sum of the individual displacements.' },
                { term: 'Resonance', definition: 'The phenomenon where a system vibrates at maximum amplitude when driven at or near its natural frequency.' },
                { term: 'Wave Speed', definition: 'The speed at which a wave pattern travels through a medium; equal to the product of frequency and wavelength (v = fλ).' },
              ]
            },
            {
              id: 'ph-light',
              name: 'Light & Optics',
              cards: [
                { term: 'Refraction', definition: 'The bending of a wave as it passes from one medium to another due to a change in wave speed.' },
                { term: 'Reflection', definition: 'The bouncing of a wave off a surface; the angle of incidence equals the angle of reflection.' },
                { term: 'Total Internal Reflection', definition: 'Complete reflection of light back into a denser medium when the angle of incidence exceeds the critical angle.' },
                { term: 'Critical Angle', definition: 'The angle of incidence in a denser medium at which refraction produces an angle of 90°; beyond this, total internal reflection occurs.' },
                { term: "Snell's Law", definition: 'The relationship n₁sinθ₁ = n₂sinθ₂ describing how light bends at the boundary between two media with different refractive indices.' },
                { term: 'Diffraction', definition: 'The spreading of waves around corners or through openings; most significant when the gap size is similar to the wavelength.' },
                { term: 'Refractive Index', definition: 'The ratio of the speed of light in a vacuum to its speed in a given medium; n = c/v. A dimensionless quantity greater than 1.' },
                { term: 'Electromagnetic Spectrum', definition: 'The range of all electromagnetic radiation ordered by frequency or wavelength, from radio waves through to gamma rays.' },
              ]
            }
          ]
        },
        {
          id: 'ph-thermo',
          name: 'Thermodynamics',
          chapters: [
            {
              id: 'ph-heat',
              name: 'Heat & Temperature',
              cards: [
                { term: 'Temperature', definition: 'A measure of the average kinetic energy of particles in a substance; measured in kelvin (K) or degrees Celsius (°C).' },
                { term: 'Thermal Equilibrium', definition: 'The state reached when two objects in contact have the same temperature and there is no net flow of heat between them.' },
                { term: 'Specific Heat Capacity', definition: 'The energy required to raise the temperature of 1 kg of a substance by 1 K; symbol c, units J kg⁻¹ K⁻¹.' },
                { term: 'Latent Heat', definition: 'The energy absorbed or released during a phase change (e.g. melting or boiling) without any change in temperature.' },
                { term: 'Conduction', definition: 'The transfer of thermal energy through a material via direct particle-to-particle interaction without bulk movement.' },
                { term: 'Convection', definition: 'The transfer of thermal energy via bulk movement of a fluid caused by density differences due to temperature gradients.' },
                { term: 'Radiation', definition: 'The transfer of energy by electromagnetic waves (mainly infrared); requires no medium and occurs even through a vacuum.' },
                { term: 'Absolute Zero', definition: 'The lowest possible temperature, 0 K (−273.15°C), at which particles have the minimum possible kinetic energy.' },
              ]
            },
            {
              id: 'ph-thermo-laws',
              name: 'Laws of Thermodynamics',
              cards: [
                { term: 'First Law of Thermodynamics', definition: 'Energy cannot be created or destroyed; the change in internal energy equals heat added to the system minus work done by the system.' },
                { term: 'Second Law of Thermodynamics', definition: 'Heat flows spontaneously from hot to cold bodies; the entropy of an isolated system always increases or remains constant.' },
                { term: 'Entropy', definition: 'A measure of the disorder or randomness of a system; increases in all spontaneous irreversible processes.' },
                { term: 'Internal Energy', definition: 'The total kinetic and potential energy of all the particles within a thermodynamic system.' },
                { term: 'Isothermal Process', definition: 'A thermodynamic process occurring at constant temperature; for an ideal gas, internal energy does not change.' },
                { term: 'Adiabatic Process', definition: 'A thermodynamic process in which no heat is exchanged with the surroundings (Q = 0); temperature changes via work alone.' },
                { term: 'Heat Engine', definition: 'A device that converts thermal energy into mechanical work by transferring heat from a hot reservoir to a cold reservoir.' },
                { term: 'Thermodynamic System', definition: 'A defined region of space or quantity of matter under study; classified as open, closed, or isolated based on energy/matter exchange.' },
              ]
            }
          ]
        },
        {
          id: 'ph-em',
          name: 'Electricity & Magnetism',
          chapters: [
            {
              id: 'ph-circuits',
              name: 'Electric Circuits',
              cards: [
                { term: 'Current', definition: 'The rate of flow of electric charge past a point in a circuit; measured in amperes (A). I = Q/t.' },
                { term: 'Resistance', definition: 'The opposition to the flow of electric current in a conductor; measured in ohms (Ω).' },
                { term: "Ohm's Law", definition: 'The current through a conductor is directly proportional to the voltage across it at constant temperature; V = IR.' },
                { term: 'Electromotive Force', definition: 'The energy transferred per unit charge by a source of electrical energy such as a battery; measured in volts (V).' },
                { term: "Kirchhoff's Current Law", definition: 'The sum of currents entering a node equals the sum of currents leaving it; based on conservation of charge.' },
                { term: "Kirchhoff's Voltage Law", definition: 'The sum of all voltages around any closed loop in a circuit equals zero; based on conservation of energy.' },
                { term: 'Series Circuit', definition: 'A circuit in which components are connected end-to-end in a single loop; the same current flows through all components.' },
                { term: 'Parallel Circuit', definition: 'A circuit in which components share the same two terminal nodes; the same voltage appears across all branches.' },
              ]
            },
            {
              id: 'ph-magnetism',
              name: 'Magnetism & Induction',
              cards: [
                { term: 'Magnetic Field', definition: 'A region of space where a magnetic force acts on moving charges or magnetic materials; measured in tesla (T).' },
                { term: 'Magnetic Flux', definition: 'The total magnetic field passing perpendicularly through a surface; Φ = BA; measured in webers (Wb).' },
                { term: "Faraday's Law", definition: 'The induced EMF in a circuit is equal to the negative rate of change of magnetic flux linkage through the circuit.' },
                { term: "Lenz's Law", definition: 'The direction of an induced current is always such that it opposes the change in magnetic flux that produced it.' },
                { term: 'Electromagnetic Induction', definition: 'The production of an EMF in a conductor due to a changing magnetic flux; the basis of generators and transformers.' },
                { term: 'Motor Effect', definition: 'The force experienced by a current-carrying conductor placed in an external magnetic field; F = BIL sinθ.' },
                { term: 'Transformer', definition: 'A device using electromagnetic induction to change AC voltage between two coil windings on a shared iron core.' },
                { term: 'Solenoid', definition: 'A coil of wire carrying current that produces a uniform magnetic field inside it, behaving like a bar magnet externally.' },
              ]
            }
          ]
        },
        {
          id: 'ph-modern',
          name: 'Modern Physics',
          chapters: [
            {
              id: 'ph-quantum',
              name: 'Quantum Mechanics',
              cards: [
                { term: 'Photon', definition: 'A discrete quantum of electromagnetic energy with energy E = hf, where h is Planck\'s constant and f is frequency.' },
                { term: 'Photoelectric Effect', definition: 'The emission of electrons from a metal surface when light above a threshold frequency shines on it; cannot be explained classically.' },
                { term: 'Wave-Particle Duality', definition: 'The principle that quantum objects exhibit both wave-like and particle-like properties depending on the experiment performed.' },
                { term: 'de Broglie Wavelength', definition: 'The wavelength associated with a moving particle; λ = h/p, where p is the particle\'s momentum. Significant only at atomic scales.' },
                { term: 'Heisenberg Uncertainty Principle', definition: 'It is impossible to simultaneously know the exact position and exact momentum of a particle; Δx·Δp ≥ ħ/2.' },
                { term: 'Energy Level', definition: 'A discrete, quantised value of energy that an electron can occupy within an atom; electrons absorb or emit photons when transitioning.' },
                { term: 'Emission Spectrum', definition: 'The set of discrete frequencies of light emitted by excited atoms when electrons drop from higher to lower energy levels.' },
                { term: "Planck's Constant", definition: 'A fundamental physical constant h ≈ 6.63 × 10⁻³⁴ J·s relating the energy of a photon to its frequency; E = hf.' },
              ]
            },
            {
              id: 'ph-relativity',
              name: 'Special Relativity',
              cards: [
                { term: 'Special Relativity', definition: 'Einstein\'s theory stating that the laws of physics are identical in all inertial frames and the speed of light is constant for all observers.' },
                { term: 'Time Dilation', definition: 'The slowing of time experienced by an observer in relative motion compared to a stationary one; t′ = γt₀.' },
                { term: 'Length Contraction', definition: 'The shortening of an object\'s measured length in the direction of motion for a relativistic observer; L′ = L₀/γ.' },
                { term: 'Rest Mass Energy', definition: 'The energy equivalent of an object\'s rest mass, even when stationary; given by Einstein\'s famous equation E₀ = mc².' },
                { term: 'Lorentz Factor', definition: 'The factor γ = 1/√(1 − v²/c²) that quantifies relativistic effects including time dilation and length contraction.' },
                { term: 'Mass-Energy Equivalence', definition: 'The principle that mass and energy are two forms of the same thing, interconvertible via E = mc².' },
                { term: 'Inertial Reference Frame', definition: 'A frame of reference that is not accelerating; Newton\'s first law holds and the laws of physics take their simplest form.' },
                { term: 'Relativistic Momentum', definition: 'The momentum of a fast-moving object corrected by the Lorentz factor: p = γmv; it approaches infinity as v → c.' },
              ]
            }
          ]
        },
        {
          id: 'ph-nuclear',
          name: 'Nuclear Physics',
          chapters: [
            {
              id: 'ph-nuclear-structure',
              name: 'Nuclear Structure',
              cards: [
                { term: 'Nucleus', definition: 'The dense central region of an atom containing protons and neutrons; contains nearly all the atomic mass in a tiny volume.' },
                { term: 'Atomic Number', definition: 'The number of protons in the nucleus of an atom, denoted Z; uniquely identifies the chemical element.' },
                { term: 'Mass Number', definition: 'The total number of protons and neutrons (nucleons) in the nucleus of an atom; denoted A.' },
                { term: 'Isotope', definition: 'Atoms of the same element that have the same number of protons but different numbers of neutrons in their nuclei.' },
                { term: 'Nuclear Binding Energy', definition: 'The energy required to completely separate all nucleons in a nucleus; released when a nucleus assembles from its constituent nucleons.' },
                { term: 'Strong Nuclear Force', definition: 'The short-range fundamental force that holds nucleons together in the nucleus; much stronger than electrostatic repulsion at close range.' },
                { term: 'Nucleon', definition: 'A particle found in the nucleus of an atom; either a proton (positive charge) or a neutron (no charge).' },
                { term: 'Mass Defect', definition: 'The difference between the total mass of separate nucleons and the measured mass of the assembled nucleus; equivalent to binding energy via E = mc².' },
              ]
            },
            {
              id: 'ph-radioactivity',
              name: 'Radioactivity',
              cards: [
                { term: 'Radioactive Decay', definition: 'The spontaneous disintegration of an unstable nucleus, emitting radiation in the form of alpha, beta, or gamma radiation.' },
                { term: 'Alpha Decay', definition: 'Emission of an alpha particle (2 protons + 2 neutrons) from an unstable nucleus, reducing mass number by 4 and atomic number by 2.' },
                { term: 'Beta Decay', definition: 'Emission of an electron (β⁻) or positron (β⁺) from a nucleus as a neutron converts to a proton or vice versa.' },
                { term: 'Gamma Radiation', definition: 'High-energy electromagnetic radiation emitted from a nucleus transitioning to a lower energy state; has no mass or charge.' },
                { term: 'Half-Life', definition: 'The time required for half the radioactive nuclei in a sample to decay; a constant characteristic of each isotope.' },
                { term: 'Activity', definition: 'The number of radioactive decays per second in a sample; measured in becquerels (Bq). A = λN.' },
                { term: 'Nuclear Fission', definition: 'The splitting of a heavy nucleus into smaller fragments, releasing large amounts of energy; the process used in nuclear reactors.' },
                { term: 'Nuclear Fusion', definition: 'The joining of light nuclei to form a heavier nucleus, releasing energy; the process that powers stars including the Sun.' },
              ]
            }
          ]
        }
      ]
    }
];
