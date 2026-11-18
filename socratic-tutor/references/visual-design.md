# Designing a visual tutoring turn

Build the visual for the specific concept in the current reply. Choose a baseline,
one change the learner can make, and the observation the change supports. For an
ongoing lesson, keep outcomes hidden during unaided checks. For a standalone
question, use the visual immediately with a short explanation. After a guided
turn, use a new case to check whether the student can reason independently.

## Render in the conversation

- **ChatGPT.** Use Visualize where the current chat offers it. On supported
  accounts the student can ask for a custom visual or select `@Visualize`.
  [ChatGPT Visualize](https://learn.chatgpt.com/docs/visualizations)
- **Claude.** Use an inline custom visual on supported surfaces. A rendered
  Artifact is another way to keep the interaction in the conversation.
  [Claude custom visuals](https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork)
- **Gemini and other hosts.** Use a native inline visual if exposed in that
  chat or a rendered preview such as Gemini Canvas. A short comparison or
  labeled sketch works in text-only sessions. [Gemini Canvas](https://support.google.com/gemini/answer/16047321)

Use an interactive renderer to show the control and result in the reply. A
learner should be able to act on the model and immediately see what changed.
For a process, make back/next or a step selector change the relevant components.
For a graph, update the curve or marker and its numeric readout together.

## Match the interaction to the question

| Learning obstacle | Interaction with a reason to use it |
| --- | --- |
| Spatial arrangement changes the interpretation | Rotate a phylogenetic node while holding ancestry fixed, or change perspective on one stereocenter while holding its configuration fixed. |
| Several events are being conflated | Step through chromosome behavior in meiosis I and II, or show how an ion channel's state changes across an action potential. |
| A learner confuses cause and outcome | Change one input and compare with a fixed baseline, such as substrate concentration and reaction rate. |
| A measured signal seems disconnected from a mechanism | Highlight the hydrogens behind a selected NMR signal, or link measured absorbance to transmitted light and path length. |
| A trend alone hides its limits | Move through an equilibrium or selection model and ask where the assumed relationship stops applying. |

For a student's question about hemoglobin and pH, show oxygen saturation
against oxygen partial pressure. Keep the reference curve fixed and let the
learner adjust pH. At a fixed oxygen partial pressure, the model should show
lower saturation as pH decreases. Label the curves and state that the values
are illustrative. [OpenStax Biology · gas transport](https://openstax.org/books/biology-2e/pages/39-4-transport-of-gases-in-human-bodily-fluids)

## Verify the science and interaction

A figure should encode the science directly. Use directional arrows, orientation
and compartment names, distinctive encodings that work without color, and
consistent scales and units across conditions. For a molecular model specify
what species or system it represents and which structural features are
schematic. For a quantitative model state equations, fixed parameters, units,
and the valid domain. Distinguish simulated values from measurements. Check
the initial state and at least one changed state against conservation, charge,
strand or arrow direction, units, and limiting cases as applicable. When a
preview can be tested, change the control and inspect the resulting display.
Include a text equivalent and labeled keyboard controls. Use original diagrams
and sample data. Keep course exercises at the conceptual study level.

## Teaching and design sources

- Student-generated explanations and discussion followed by feedback inform the
  predict–test–explain sequence. Freeman et al. aggregate evidence from
  undergraduate STEM classrooms. Smith et al. compare forms of feedback
  following reasoning about genetics questions. [Freeman et al., 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4060654/) · [Smith et al., 2011](https://pubmed.ncbi.nlm.nih.gov/21364100/)
- Ask for independent recall and a novel application after the scaffold has
  been removed. Retrieval from science text supported later conceptual
  performance in a controlled study. [Karpicke and Blunt, 2011](https://doi.org/10.1126/science.1199327)
- Keep the interaction focused. Research on simulation use and an undergraduate
  meiosis module informs the use of guided inputs, segmenting, and feedback.
  [Podolefsky et al., 2010](https://doi.org/10.1103/PhysRevSTPER.6.020117) · [Goff et al., 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5332052/) · [Perkins et al., 2014](https://doi.org/10.1039/C3RP20157K)

## Further interactive sources

[RCSB PDB-101](https://pdb101.rcsb.org/) for structural biology and molecular
function. [HHMI BioInteractive](https://www.biointeractive.org/)
for ecology, genetics, evolution, and experimental evidence.
[PhET chemistry simulations](https://phet.colorado.edu/en/simulations/filter?subjects=chemistry&type=html)
for chemistry concepts. Open and check a specific resource before recommending it.
