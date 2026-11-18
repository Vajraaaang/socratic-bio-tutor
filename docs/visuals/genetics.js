import { arrow, circle, label, line, rect } from './drawing.js';

const referenceCoding = 'ATGGAACCTTTCTGA';
const variants = {
  reference: { sequence: referenceCoding, changedAt: Infinity },
  synonymous: { sequence: 'ATGGAGCCTTTCTGA', changedAt: 5 },
  missense: { sequence: 'ATGGTACCTTTCTGA', changedAt: 4 },
  nonsense: { sequence: 'ATGTAACCTTTCTGA', changedAt: 3 },
  deletion: { sequence: 'ATGGACCTTTCTGA', changedAt: 5, shifted: true },
};
const complementaryBase = { A: 'T', C: 'G', G: 'C', T: 'A' };
const aminoAcid = {
  AUG: 'Met', GAA: 'Glu', GAG: 'Glu', CCU: 'Pro', UUC: 'Phe', GUA: 'Val',
  GAC: 'Asp', CUU: 'Leu', UCU: 'Ser', UGA: 'Stop', UAA: 'Stop',
};

const triplets = sequence => sequence.match(/.{1,3}/g);
const tripletX = index => 178 + 94 * index;

function drawBases(ctx, colors, sequence, variant, y, fill) {
  triplets(sequence).forEach((group, groupIndex) => {
    [...group].forEach((base, index) => {
      const position = groupIndex * 3 + index;
      const changed = variant.shifted ? position >= variant.changedAt : position === variant.changedAt;
      const x = tripletX(groupIndex) + 26 * index;
      rect(ctx, x, y - 15, 23, 30, {
        fill: changed ? colors.rustSoft : fill,
        stroke: changed ? colors.rust : undefined,
        radius: 4,
      });
      label(ctx, base, x + 11.5, y, {size: 19, color: colors.ink, weight: 700, align: 'center'});
    });
  });
}

function drawDirections(ctx, colors, y, start, end) {
  label(ctx, start, 165, y, {color: colors.muted, size: 17, align: 'right'});
  label(ctx, end, 657, y, {color: colors.muted, size: 17});
}

function drawGeneExpression(ctx, colors, variant, template, rna, peptide, stopIndex, showRNA, showPeptide) {
  label(ctx, 'DNA duplex', 24, 26, {color: colors.ink, size: 18, weight: 700});
  label(ctx, 'Coding DNA', 24, 61, {color: colors.ink});
  label(ctx, 'Template DNA', 24, 111, {color: colors.ink});
  drawDirections(ctx, colors, 61, '5′', '3′');
  drawDirections(ctx, colors, 111, '3′', '5′');
  [...variant.sequence].forEach((_, index) => {
    const center = tripletX(Math.floor(index / 3)) + 26 * (index % 3) + 11.5;
    line(ctx, center, 76, center, 96, {color: colors.muted, width: 1, dash: [2, 3]});
  });
  drawBases(ctx, colors, variant.sequence, variant, 61, colors.blueSoft);
  drawBases(ctx, colors, template, variant, 111, colors.blueSoft);

  if (showRNA) {
    arrow(ctx, 24, 153, 54, 153, {color: colors.teal});
    label(ctx, 'RNA polymerase reads the template 3′ → 5′', 66, 153, {color: colors.muted});
    label(ctx, 'mRNA', 24, 189, {color: colors.ink, size: 18, weight: 700});
    drawDirections(ctx, colors, 189, '5′', '3′');
    drawBases(ctx, colors, rna.join(''), variant, 189, colors.tealSoft);
  }

  if (showPeptide) {
    arrow(ctx, 24, 242, 54, 242, {color: colors.violet});
    label(ctx, 'Ribosome reads the mRNA 5′ → 3′ in triplets', 66, 242, {color: colors.muted});
    label(ctx, 'Peptide', 24, 295, {color: colors.ink, size: 18, weight: 700});
    label(ctx, 'N → C', 24, 321, {color: colors.muted, size: 17});

    peptide.forEach((residue, index) => {
      const x = tripletX(index);
      if (index > 0) {
        line(ctx, x - 19, 295, x, 295, {color: colors.violet, width: 3});
      }
      rect(ctx, x, 274, 75, 42, {fill: colors.violetSoft, radius: 8});
      label(ctx, residue, x + 37.5, 295, {size: 20, color: colors.ink, weight: 700, align: 'center'});
    });

    if (stopIndex === -1) {
      label(ctx, 'No in-frame stop in the fragment shown.', tripletX(0), 341, {color: colors.muted, size: 17});
    } else {
      const x = tripletX(stopIndex);
      rect(ctx, x, 274, 75, 42, {fill: colors.goldSoft, radius: 8});
      label(ctx, 'STOP', x + 37.5, 295, {size: 17, color: colors.ink, weight: 700, align: 'center'});
    }
  }

  if (Number.isFinite(variant.changedAt)) {
    rect(ctx, 24, 365, 12, 12, {fill: colors.rustSoft, stroke: colors.rust, radius: 2});
    label(ctx, variant.shifted ? 'Grouping downstream of the deletion' : 'Substituted base pair',
      45, 371, {color: colors.muted});
  }
}

const geneExpression = {
  id: 'gene-expression',
  subject: 'Biology',
  title: 'From DNA to peptide',
  course: 'BIO SCI 93 · 97 · 99',
  intro: 'Trace a short coding region from paired DNA strands to mRNA codons and a peptide.',
  prediction: 'If the second mRNA codon changes from GAA to GAG, will the second amino acid change?',
  controls: [
    {key: 'variant', label: 'DNA variant', type: 'select', value: 'reference', options: [
      {value: 'reference', label: 'Reference'},
      {value: 'synonymous', label: 'Substitution · base 6 A → G'},
      {value: 'missense', label: 'Substitution · base 5 A → T'},
      {value: 'nonsense', label: 'Substitution · base 4 G → T'},
      {value: 'deletion', label: 'Deletion · base 6'},
    ]},
    {key: 'stage', label: 'Show through', type: 'select', value: 'translation', options: [
      {value: 'dna', label: 'DNA pairing'},
      {value: 'transcription', label: 'Transcription'},
      {value: 'translation', label: 'Translation'},
    ]},
  ],
  source: {label: 'OpenStax Biology 2e · The genetic code', url: 'https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code'},
  assumptions: 'This short classroom fragment begins at the AUG start codon and uses the standard genetic code. The two DNA strands run in opposite directions. The diagram omits initiation signals, RNA processing, tRNAs and other machinery. A shifted fragment with no in-frame stop shown could continue beyond its displayed end.',
  render(values) {
    const variant = variants[values.variant];
    const template = [...variant.sequence].map(base => complementaryBase[base]).join('');
    const rna = triplets(variant.sequence.replaceAll('T', 'U'));
    const stopIndex = rna.findIndex(codon => aminoAcid[codon] === 'Stop');
    const translated = stopIndex < 0 ? rna.filter(codon => codon.length === 3) : rna.slice(0, stopIndex);
    const peptide = translated.map(codon => aminoAcid[codon]);
    const showRNA = values.stage !== 'dna';
    const showPeptide = values.stage === 'translation';
    const metrics = [
      {label: 'Coding DNA (5′ → 3′)', value: triplets(variant.sequence).join(' ')},
      {label: 'Template DNA (3′ → 5′)', value: triplets(template).join(' ')},
    ];
    let summary = 'The paired DNA strands are antiparallel.';
    if (showRNA) {
      metrics.push({label: 'mRNA (5′ → 3′)', value: rna.join(' ')});
      summary = 'RNA polymerase uses the template strand and synthesizes RNA 5′ → 3′.';
    }
    if (showPeptide) {
      metrics.push(
        {label: 'Peptide (N → C)', value: peptide.join('–')},
        {label: 'Translation stop', value: stopIndex < 0
          ? 'No in-frame stop in this fragment' : `Codon ${stopIndex + 1} · ${rna[stopIndex]}`},
      );
      summary = 'The ribosome begins at AUG and translates consecutive codons until it reaches an in-frame stop.';
    }
    return {
      figureLabel: showPeptide ? 'Antiparallel DNA, mRNA codons and the peptide they encode'
        : showRNA ? 'Antiparallel DNA and its mRNA transcript' : 'Antiparallel DNA strands with paired bases',
      summary,
      metrics,
      draw(ctx, colors) {
        drawGeneExpression(ctx, colors, variant, template, rna, peptide, stopIndex, showRNA, showPeptide);
      },
    };
  },
};

function drawHomolog(ctx, colors, haplotype, y, color, fill) {
  line(ctx, 54, y, 376, y, {color, width: 6});
  [133, 288].forEach((x, index) => {
    circle(ctx, x, y, 16, {fill, stroke: color, width: 2});
    label(ctx, haplotype[index], x, y, {color: colors.ink, size: 20, weight: 700, align: 'center'});
  });
}

function drawLinkage(ctx, colors, parents, classes) {
  label(ctx, 'Heterozygote’s homologs', 24, 27, {color: colors.ink, size: 18, weight: 700});
  drawHomolog(ctx, colors, parents[0], 73, colors.teal, colors.tealSoft);
  drawHomolog(ctx, colors, parents[1], 121, colors.violet, colors.violetSoft);
  rect(ctx, 417, 23, 275, 119, {fill: colors.grid, radius: 10});
  label(ctx, 'Recessive tester', 436, 51, {color: colors.ink, size: 18, weight: 700});
  label(ctx, 'aabb gives only ab gametes', 436, 89, {color: colors.ink, size: 17});
  label(ctx, 'Expected offspring (%)', 24, 182, {color: colors.ink, size: 18, weight: 700});

  const baseline = 323;
  for (const tick of [0, 25, 50]) {
    const y = baseline - 2.1 * tick;
    line(ctx, 67, y, 688, y, {color: tick === 0 ? colors.muted : colors.grid, width: 1});
    label(ctx, String(tick), 59, y, {color: colors.muted, size: 16, align: 'right'});
  }

  classes.forEach(({offspring, parental, percent}, index) => {
    const x = 146 + index * 151;
    const height = 2.1 * percent;
    const color = parental ? colors.teal : colors.violet;

    if (height > 0) {
      rect(ctx, x - 34, baseline - height, 68, height, {fill: color});
    }

    label(ctx, `${percent}%`, x, baseline - height - 13, {color: colors.ink, size: 17, weight: 700, align: 'center'});
    label(ctx, offspring, x, 350, {color: colors.ink, size: 20, weight: 700, align: 'center'});
    label(ctx, parental ? 'Parental' : 'Recombinant', x, 377, {color: colors.muted, size: 16, align: 'center'});
  });
}

const linkedGenes = {
  id: 'linked-genes',
  subject: 'Biology',
  title: 'Linked genes in a testcross',
  course: 'BIO SCI 97',
  intro: 'Set the allele arrangement and recombination fraction for an AaBb × aabb testcross.',
  prediction: 'If you swap the heterozygote from cis to trans at the same recombination fraction, which offspring genotypes become most frequent?',
  controls: [
    {key: 'phase', label: 'Allele arrangement', type: 'select', value: 'cis', options: [
      {value: 'cis', label: 'Cis · AB / ab'},
      {value: 'trans', label: 'Trans · Ab / aB'},
    ]},
    {key: 'recombination', label: 'Recombinant gametes', type: 'range', value: 20, min: 0, max: 50, step: 1, unit: '%'},
  ],
  source: {label: 'OpenStax Biology 2e · Genetic linkage', url: 'https://openstax.org/books/biology-2e/pages/13-1-chromosomal-theory-and-genetic-linkage'},
  assumptions: 'In this two-locus model, reciprocal gamete classes are equally likely within each category and all offspring have equal survival. The tester’s ab gamete lets the offspring genotype reveal the heterozygote’s gamete. At 50% recombination, widely separated loci on the same chromosome can look like loci on different chromosomes. Recombination fraction and number of crossover events measure different things.',
  render(values) {
    const parents = values.phase === 'cis' ? ['AB', 'ab'] : ['Ab', 'aB'];
    const gametes = ['AB', 'Ab', 'aB', 'ab'];
    const offspring = ['AaBb', 'Aabb', 'aaBb', 'aabb'];
    const classes = gametes.map((gamete, index) => {
      const parental = parents.includes(gamete);
      const percent = (parental ? 100 - values.recombination : values.recombination) / 2;
      return {gamete, offspring: offspring[index], parental, percent};
    });
    return {
      figureLabel: 'Two homologous chromosomes and four expected testcross offspring frequencies',
      summary: `The heterozygote’s parental haplotypes are ${parents.join(' and ')}. Every offspring also receives ab from the tester.`,
      metrics: classes.map(({gamete, offspring, parental, percent}) => ({
        label: `${gamete} → ${offspring}`,
        value: `${percent}% · ${parental ? 'Parental' : 'Recombinant'}`,
      })),
      draw(ctx, colors) {
        drawLinkage(ctx, colors, parents, classes);
      },
    };
  },
};

function drawLacOperon(ctx, colors, capBound, repressorBound, output) {
  rect(ctx, 25, 21, 318, 106, {fill: colors.tealSoft, radius: 12});
  rect(ctx, 378, 21, 317, 106, {fill: colors.rustSoft, radius: 12});
  label(ctx, capBound ? 'Glucose scarce · cAMP high' : 'Glucose abundant · cAMP low',
    44, 48, {color: colors.ink, weight: 700, size: 18});
  label(ctx, capBound ? 'CAP–cAMP binds DNA' : 'CAP stays off DNA', 44, 88, {color: colors.ink, size: 18});
  label(ctx, repressorBound ? 'Lactose absent' : 'Lactose present → allolactose',
    396, 48, {color: colors.ink, weight: 700, size: 18});
  label(ctx, repressorBound ? 'LacI binds the operator' : 'Allolactose keeps LacI off DNA',
    396, 88, {color: colors.ink, size: 18});

  const dnaY = 218;
  const capX = 85;
  const promoterX = 187;
  const operatorX = 293;
  const sites = [
    {x: capX, width: 95, label: 'CAP site', fill: capBound ? colors.tealSoft : colors.grid},
    {x: promoterX, width: 98, label: 'Promoter', fill: colors.blueSoft},
    {x: operatorX, width: 98, label: 'Operator', fill: repressorBound ? colors.rustSoft : colors.grid},
    {x: 398, width: 90, label: 'lacZ', fill: colors.violetSoft},
    {x: 495, width: 90, label: 'lacY', fill: colors.violetSoft},
    {x: 592, width: 90, label: 'lacA', fill: colors.violetSoft},
  ];

  line(ctx, 26, dnaY - 4, 694, dnaY - 4, {color: colors.ink});
  line(ctx, 26, dnaY + 4, 694, dnaY + 4, {color: colors.ink});
  label(ctx, 'DNA', 31, 196, {color: colors.muted, size: 16, weight: 700});

  if (capBound) {
    rect(ctx, capX + 1, 156, 93, 40, {fill: colors.teal, radius: 16});
    label(ctx, 'CAP–cAMP', capX + 47.5, 176, {color: colors.white, size: 15, weight: 700, align: 'center'});
    line(ctx, capX + 47.5, 196, capX + 47.5, 202, {color: colors.teal, width: 3});
  }
  rect(ctx, promoterX + 11, 156, 76, 40, {fill: repressorBound ? colors.blueSoft : colors.blue, radius: 16});
  label(ctx, 'RNAP', promoterX + 49, 176, {
    color: repressorBound ? colors.ink : colors.white, size: 16, weight: 700, align: 'center',
  });
  if (!repressorBound) {
    line(ctx, promoterX + 49, 196, promoterX + 49, 202, {color: colors.blue, width: 3});
  }

  if (repressorBound) {
    rect(ctx, operatorX + 14, 156, 70, 40, {fill: colors.rust, radius: 16});
    label(ctx, 'LacI', operatorX + 49, 176, {color: colors.white, size: 17, weight: 700, align: 'center'});
    line(ctx, operatorX + 49, 196, operatorX + 49, 202, {color: colors.rust, width: 3});
  }

  sites.forEach(({x, width, label: siteLabel, fill}) => {
    rect(ctx, x, dnaY - 16, width, 32, {fill, stroke: colors.muted, width: 1, radius: 4});
    label(ctx, siteLabel, x + width / 2, dnaY, {color: colors.ink, size: 17, weight: 650, align: 'center'});
  });

  const transcriptCount = repressorBound ? 1 : capBound ? 4 : 2;
  const processY = 266;
  if (repressorBound) {
    line(ctx, 237, processY, 320, processY, {color: colors.rust, dash: [4, 3]});
    line(ctx, 319, processY - 7, 319, processY + 7, {color: colors.rust, width: 3});
    label(ctx, 'LacI represses transcription', 337, processY, {color: colors.ink, size: 17});
  } else {
    arrow(ctx, 237, processY, 679, processY, {color: colors.teal});
    label(ctx, '5′ → 3′', 664, 251, {color: colors.muted, size: 16, align: 'right'});
  }
  rect(ctx, 25, 292, 670, 84, {fill: colors.grid, radius: 12});
  label(ctx, 'lacZYA transcription', 45, 317, {color: colors.ink, size: 17});
  label(ctx, output, 45, 349, {color: colors.ink, size: 21, weight: 700});
  for (let index = 0; index < transcriptCount; index++) {
    const y = 315 + 13 * index;
    arrow(ctx, 373, y, 666, y, {color: colors.teal, width: 2, head: 8});
  }
}

const geneRegulation = {
  id: 'gene-regulation',
  subject: 'Biology',
  title: 'Lac operon regulation',
  course: 'BIO SCI 99 · M122',
  intro: 'Change glucose and lactose availability to see when two regulators bind the DNA of the E. coli lac operon.',
  prediction: 'If lactose becomes available while glucose stays scarce, what happens to transcription?',
  controls: [
    {key: 'lactose', label: 'Lactose', type: 'select', value: 'absent', options: [
      {value: 'absent', label: 'Absent'}, {value: 'present', label: 'Present'},
    ]},
    {key: 'glucose', label: 'Glucose', type: 'select', value: 'scarce', options: [
      {value: 'scarce', label: 'Scarce'}, {value: 'abundant', label: 'Abundant'},
    ]},
  ],
  source: {label: 'OpenStax Biology 2e · Prokaryotic gene regulation', url: 'https://openstax.org/books/biology-2e/pages/16-2-prokaryotic-gene-regulation'},
  assumptions: 'Allolactose, made from lactose, binds LacI and lowers its affinity for the operator. Scarce glucose raises cAMP, which binds CAP and promotes its binding upstream of the promoter. CAP helps recruit RNA polymerase (RNAP). The diagram flattens overlapping DNA sites into separate blocks. lacZ, lacY and lacA are co-transcribed into one mRNA. Trace count represents qualitative expression and includes basal leak; it has no quantitative units.',
  render(values) {
    const capBound = values.glucose === 'scarce';
    const repressorBound = values.lactose === 'absent';
    const output = repressorBound ? 'Very low (leak)' : capBound ? 'High' : 'Low';
    const metrics = [
      {label: 'CAP at binding site', value: capBound ? 'Bound' : 'Unbound'},
      {label: 'LacI at operator', value: repressorBound ? 'Bound' : 'Unbound'},
      {label: 'Transcription', value: output},
    ];
    return {
      figureLabel: 'CAP, RNA polymerase and LacI at the lac regulatory region, with qualitative transcript output',
      summary: 'The CAP binding site, promoter and operator control transcription of the adjacent lacZ, lacY and lacA genes.',
      metrics,
      draw(ctx, colors) {
        drawLacOperon(ctx, colors, capBound, repressorBound, output);
      },
    };
  },
};

export const geneticsModels = [geneExpression, linkedGenes, geneRegulation];
