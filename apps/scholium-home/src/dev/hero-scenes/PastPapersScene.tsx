import { FileText, ScrollText, Download } from "lucide-react";

/* Only Mathematics is currently available, so the scene shows the real
 * chapter-browsing moment for one subject (mirroring ChaptersPage) rather than
 * implying several subjects exist. */
const CHAPTERS = [
  { number: 1, name: "Number" },
  { number: 2, name: "Algebra" },
  { number: 3, name: "Geometry" },
  { number: 4, name: "Trigonometry" },
];

export default function PastPapersScene() {
  return (
    <div className="hero-scene hs-papers" data-slug="past-papers">
      <div className="hs-papers-inner">
        <div className="hs-pp-head">
          <div className="hs-crumbs">Subjects · Mathematics · Paper 4</div>
          <div className="hs-pp-title">Mathematics</div>
          <div className="hs-pp-sub">Each chapter has a paper compilation and its mark scheme.</div>
        </div>
        <div className="hs-grid2">
          {CHAPTERS.map((c) => (
            <article key={c.number} className="hs-chap">
              <div className="hs-chap-head">
                <span className="hs-chap-num">{c.number}</span>
                <h3 className="hs-chap-name">{c.name}</h3>
              </div>
              <div className="hs-chap-links">
                <span className="hs-plink hs-plink--qp">
                  <FileText size={22} />
                  <span className="hs-plink-label">Question paper</span>
                  <Download size={18} className="hs-dl" />
                </span>
                <span className="hs-plink hs-plink--ms">
                  <ScrollText size={22} />
                  <span className="hs-plink-label">Mark scheme</span>
                  <Download size={18} className="hs-dl" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
