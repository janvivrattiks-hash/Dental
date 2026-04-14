import { CircleHelp, X } from 'lucide-react';
import { useState } from 'react';

const WorkflowHelpFab = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 h-12 w-12 rounded-full gradient-btn text-slate-950 font-bold grid place-content-center z-20"
      >
        {open ? <X size={18} /> : <CircleHelp size={18} />}
      </button>
      {open ? (
        <div className="fixed right-3 sm:right-6 bottom-18 sm:bottom-20 w-[min(320px,calc(100vw-1.5rem))] glass-card p-4 z-20">
          <h3 className="employee-heading text-slate-100">Workflow Guidance</h3>
          <p className="text-sm text-slate-300 mt-2">Use Step 2 to upload and assign scan bodies. Superimposition begins only after assignment is complete.</p>
          <a
            className="text-sm text-cyan-300 mt-3 inline-block"
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
          >
            Watch quick YouTube guide
          </a>
        </div>
      ) : null}
    </>
  );
};

export default WorkflowHelpFab;
