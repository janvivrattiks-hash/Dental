import { useEffect, useMemo, useState } from 'react';
import { Download, FileUp, Lock, Search, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import StepProgress from '../components/StepProgress';
import ToothChart from '../components/ToothChart';
import ScanPreview3D from '../components/ScanPreview3D';
import * as employeeMockData from '../data/mockData';
import api from '../../Script/api';

const fileSizeInMb = (size) => `${(size / (1024 * 1024)).toFixed(2)} MB`;

const fallbackAdminAnalogLibrary = employeeMockData.adminAnalogLibrary || employeeMockData.scanBodies || [];

const getCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const normalizeAdminAnalogLibrary = (payload) => {
  const rows = getCollection(payload);
  const normalized = [];

  rows.forEach((row, rowIndex) => {
    const baseBrand = row.brand || row.company || row.name || row.library_name || 'Admin Library';
    const baseSize = row.size || row.platform || row.diameter || 'N/A';

    if (Array.isArray(row.assets) && row.assets.length) {
      row.assets.forEach((asset, assetIndex) => {
        normalized.push({
          id: asset.id || asset._id || `${row.id || rowIndex}-${assetIndex}`,
          name: asset.name || asset.title || asset.asset_name || row.name || 'Analog',
          brand: asset.brand || asset.company || baseBrand,
          size: asset.size || asset.platform || asset.diameter || baseSize,
        });
      });
      return;
    }

    normalized.push({
      id: row.id || row._id || `analog-${rowIndex}`,
      name: row.name || row.title || row.asset_name || 'Analog',
      brand: baseBrand,
      size: baseSize,
    });
  });

  return normalized.filter((item) => item.name && item.id);
};

const EmployeeNewCase = () => {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({
    fullName: '',
    age: '',
    caseDate: new Date().toISOString().split('T')[0],
    notes: '',
    caseRef: `PF-${Math.floor(1000 + Math.random() * 9000)}`,
  });
  const [upload, setUpload] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [activeTooth, setActiveTooth] = useState(null);
  const [selection, setSelection] = useState('');
  const [toothAssignments, setToothAssignments] = useState({});
  const [adminAnalogOptions, setAdminAnalogOptions] = useState(fallbackAdminAnalogLibrary);
  const [isLoadingAdminLibrary, setIsLoadingAdminLibrary] = useState(false);
  const [adminLibraryError, setAdminLibraryError] = useState('');
  const [superimposed, setSuperimposed] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);

  const allAssigned = useMemo(
    () => selectedTeeth.length > 0 && selectedTeeth.every((tooth) => Boolean(toothAssignments[tooth])),
    [selectedTeeth, toothAssignments]
  );
  const canGoToStep3 = Boolean(upload) && selectedTeeth.length > 0 && allAssigned;

  useEffect(() => {
    let isMounted = true;

    const loadAdminLibrary = async () => {
      setIsLoadingAdminLibrary(true);
      setAdminLibraryError('');

      try {
        const response = await api.all_libraries.list();
        const normalized = normalizeAdminAnalogLibrary(response.data || response);

        if (!isMounted) return;

        if (normalized.length > 0) {
          setAdminAnalogOptions(normalized);
          return;
        }

        setAdminAnalogOptions(fallbackAdminAnalogLibrary);
        setAdminLibraryError('No analog records found in admin library. Showing fallback data.');
      } catch {
        if (!isMounted) return;
        setAdminAnalogOptions(fallbackAdminAnalogLibrary);
        setAdminLibraryError('Could not fetch admin analog library. Showing fallback data.');
      } finally {
        if (isMounted) {
          setIsLoadingAdminLibrary(false);
        }
      }
    };

    loadAdminLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  const onFilePicked = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['stl', 'obj', 'ply'].includes(extension)) return;
    if (file.size > 500 * 1024 * 1024) return;
    setUpload(file);
  };

  const next = () => {
    if (step === 2 && !canGoToStep3) return;
    if (step === 3 && !superimposed) return;
    setStep((value) => Math.min(value + 1, 5));
  };

  const prev = () => setStep((value) => Math.max(value - 1, 1));

  const toggleTooth = (tooth) => {
    setSelectedTeeth((current) => {
      const exists = current.includes(tooth);
      const next = exists ? current.filter((id) => id !== tooth) : [...current, tooth];

      setActiveTooth((previous) => {
        if (exists) {
          if (previous === tooth) {
            return next[0] || null;
          }
          return previous;
        }
        return previous || tooth;
      });

      return next;
    });
  };

  return (
    <div>
      <StepProgress activeStep={step} />

      {step === 1 ? (
        <section className="glass-card p-5 space-y-4">
          <h2 className="employee-heading text-lg text-slate-100">Patient Details</h2>
          <input className="glass-input h-11 px-3 w-full" placeholder="Patient Full Name" value={patient.fullName} onChange={(event) => setPatient((s) => ({ ...s, fullName: event.target.value }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="glass-input h-11 px-3" type="number" min="1" max="120" placeholder="Age" value={patient.age} onChange={(event) => setPatient((s) => ({ ...s, age: event.target.value }))} />
            <input className="glass-input h-11 px-3" value={patient.caseRef} readOnly />
          </div>
          <input className="glass-input h-11 px-3 w-full" type="date" value={patient.caseDate} onChange={(event) => setPatient((s) => ({ ...s, caseDate: event.target.value }))} />
          <textarea className="glass-input px-3 py-2 w-full min-h-28" value={patient.notes} placeholder="Any remarks..." onChange={(event) => setPatient((s) => ({ ...s, notes: event.target.value }))} />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <article className="glass-card p-5">
            <h2 className="employee-heading text-lg text-slate-100">Upload Patient Scan Data</h2>
            {!upload ? (
              <label className="block mt-4 rounded-2xl border border-cyan-400/40 p-8 text-center bg-[#041226] cursor-pointer">
                <svg viewBox="0 0 100 100" className="h-14 w-14 mx-auto text-cyan-300">
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" style={{ animation: 'marching 1.2s linear infinite' }} />
                </svg>
                <UploadCloud className="mx-auto mt-3 text-cyan-300" />
                <p className="employee-heading text-slate-100 mt-3">Drop Your Patient Scan File Here</p>
                <p className="text-sm text-slate-400 mt-1">STL · PLY · OBJ supported - Max 500MB</p>
                <span className="gradient-btn inline-flex mt-4 px-5 h-10 items-center text-slate-950 font-semibold">Browse Files</span>
                <input className="hidden" type="file" accept=".stl,.obj,.ply" onChange={onFilePicked} />
              </label>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                  <div className="text-sm text-emerald-200">✓ {upload.name} ({fileSizeInMb(upload.size)})</div>
                  <button
                    type="button"
                    onClick={() => {
                      setUpload(null);
                      setWireframeMode(false);
                    }}
                    className="text-rose-300 text-sm"
                  >
                    Remove file
                  </button>
                </div>
                <div className="rounded-xl border border-cyan-400/35 bg-[#031022] h-[380px] relative">
                  <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200">3D Scan Preview</span>
                  <div className="absolute right-3 top-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setWireframeMode(false)}
                      className={`px-2 py-1 rounded-full ${wireframeMode ? 'border border-slate-600 text-slate-300' : 'bg-slate-800 text-slate-200'}`}
                    >
                      Solid
                    </button>
                    <button
                      type="button"
                      onClick={() => setWireframeMode(true)}
                      className={`px-2 py-1 rounded-full ${wireframeMode ? 'bg-slate-800 text-slate-200' : 'border border-slate-600 text-slate-300'}`}
                    >
                      Wireframe
                    </button>
                  </div>
                  <ScanPreview3D file={upload} wireframe={wireframeMode} />
                  <div className="absolute left-3 bottom-3 text-xs text-slate-500">🖱 Drag · Scroll · Right-click to pan</div>
                </div>
              </div>
            )}
          </article>

          {upload ? (
            <article className="space-y-4">
              <div className="glass-card p-4 border-l-2 border-cyan-400/50">
                <h3 className="employee-heading text-slate-100">Select Analog from Admin Database</h3>
                <p className="text-sm text-slate-300 mt-2">Click the tooth you want to assign, then choose the matching analog from the admin library. All analogs and files come from the admin database.</p>
              </div>

              <ToothChart
                selectedTeeth={selectedTeeth}
                onToggle={toggleTooth}
                onClear={() => {
                  setSelectedTeeth([]);
                  setActiveTooth(null);
                  setToothAssignments({});
                }}
              />

              {selectedTeeth.length > 0 ? (
                <div className="glass-card p-4 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {selectedTeeth.map((tooth) => (
                        <button
                          key={tooth}
                          type="button"
                          onClick={() => {
                            setActiveTooth(tooth);
                            setSelection(toothAssignments[tooth] || '');
                          }}
                          className={`px-3 py-2 rounded-full text-sm border ${activeTooth === tooth ? 'bg-cyan-500/20 border-cyan-400/35 text-cyan-200' : 'border-slate-600 text-slate-400'}`}
                        >
                          Tooth {tooth} {toothAssignments[tooth] ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-400">
                      Active tooth: {activeTooth || 'None'}
                    </div>
                  </div>

                  {isLoadingAdminLibrary ? (
                    <div className="text-xs rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-200 px-3 py-2">
                      Loading admin analog library...
                    </div>
                  ) : null}

                  {adminLibraryError ? (
                    <div className="text-xs rounded-xl border border-amber-400/25 bg-amber-500/10 text-amber-200 px-3 py-2">
                      {adminLibraryError}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                      <input className="glass-input h-10 pl-8 pr-3" placeholder="Search" />
                    </div>
                    <select className="glass-input h-10 px-3"><option>Brand</option></select>
                    <select className="glass-input h-10 px-3"><option>Size</option></select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {adminAnalogOptions.map((body) => {
                      const isSelected = selection === body.id;
                      return (
                        <button
                          key={body.id}
                          type="button"
                          onClick={() => {
                            if (!activeTooth) return;
                            setSelection(body.id);
                            setToothAssignments((current) => ({
                              ...current,
                              [activeTooth]: body.id,
                            }));
                          }}
                          className={`text-left p-3 rounded-xl border ${isSelected ? 'border-cyan-300 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,212,255,.3)]' : 'border-slate-600 hover:border-cyan-400/35'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-slate-100">{body.name}</p>
                            <span className="text-[10px] px-2 py-1 rounded-full border border-cyan-400/25 text-cyan-200">Admin</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{body.brand} · {body.size}</p>
                          <p className="text-[11px] text-slate-500 mt-2">Click to assign to tooth {activeTooth || '...'}.</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="glass-card p-3 space-y-2">
                    <h4 className="employee-heading text-sm text-slate-100">Assignment Summary</h4>
                    {selectedTeeth.map((tooth) => {
                      const assigned = adminAnalogOptions.find((item) => item.id === toothAssignments[tooth]);
                      return (
                        <div key={tooth} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Tooth {tooth}</span>
                          <span className={assigned ? 'text-cyan-200' : 'text-amber-300'}>
                            {assigned ? `${assigned.name} · Admin Provided ✓` : '[Not assigned]'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </article>
          ) : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 glass-card p-4">
            <h2 className="employee-heading text-lg text-slate-100">Mesh Superimposition</h2>
            <p className="text-sm text-slate-400 mt-1">Patient scan is being superimposed with selected scan body reference mesh to align implant geometry precisely.</p>
            <div className="rounded-xl border border-cyan-400/35 bg-[#031022] h-[380px] mt-4 relative">
              <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded-full border border-cyan-400/35 text-cyan-200">3D Alignment Viewer</span>
              <div className="h-full grid place-content-center text-slate-400">Superimposition viewer integration point</div>
              <div className="absolute left-3 bottom-3 text-xs text-slate-500">🖱 Drag · Scroll · Right-click to pan</div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <div className="glass-card p-4 space-y-2">
              <h3 className="employee-heading text-slate-100">Mesh Visibility</h3>
              <label className="flex items-center justify-between text-slate-300"><span>Patient Scan</span><input type="checkbox" defaultChecked /></label>
              <label className="flex items-center justify-between text-slate-300"><span>Scan Body Mesh</span><input type="checkbox" defaultChecked /></label>
              <label className="flex items-center justify-between text-slate-300"><span>Analog Preview</span><input type="checkbox" defaultChecked /></label>
            </div>

            <div className="glass-card p-4 space-y-3">
              <button onClick={() => setSuperimposed(true)} className="gradient-btn h-10 w-full text-slate-950 font-semibold">Process Superimposition</button>
              {superimposed ? (
                <>
                  <span className="text-xs px-2 py-1 rounded-full border border-emerald-400/35 bg-emerald-500/20 text-emerald-200">✓ Superimposition Complete</span>
                  <p className="text-sm text-slate-300">Match score: 92%</p>
                  <p className="text-sm text-slate-300">Time: ⚡ 2.1s</p>
                  <div className="p-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-sm text-cyan-200">Analog: Selected Admin Library Match · Admin Provided</div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="grid grid-cols-1 xl:grid-cols-10 gap-4">
          <div className="xl:col-span-6 glass-card p-4 h-[420px] bg-[#031022] border border-cyan-400/35">
            <h3 className="employee-heading text-slate-100">3D Results Viewer</h3>
            <div className="h-[360px] grid place-content-center text-slate-400">Result + analog overlay integration point</div>
          </div>
          <div className="xl:col-span-4 space-y-4">
            <div className="glass-card p-4">
              <h4 className="employee-heading text-slate-100">Insertion Angles</h4>
              <div className="mt-3 space-y-3 text-sm">
                <div className="border border-cyan-400/20 rounded-xl p-3">
                  <p className="text-slate-300">Tooth 14 · Nobel Uni 3.5mm</p>
                  <p className="text-cyan-200 text-xl employee-heading mt-1">17.42°</p>
                  <p className="text-cyan-300 font-semibold">Min: 12.08°</p>
                  <p className="text-emerald-300 mt-1">✅ Within Tolerance</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h4 className="employee-heading text-slate-100">Summary</h4>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>Total implants: {selectedTeeth.length || 1}</li>
                <li>Average angle: 16.11°</li>
                <li className="text-cyan-300 text-lg employee-heading">Min angle: 12.08°</li>
                <li>Processing time: ⚡ 2.1s</li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">Calculated on backend server</p>
            </div>

            <div className="glass-card p-4">
              <h4 className="employee-heading text-slate-100">Reference Output Files</h4>
              <div className="mt-3 space-y-2 text-sm">
                <button className="w-full h-10 rounded-xl border border-cyan-400/30 text-cyan-200 flex items-center justify-between px-3">Reference Output Angle File <span className="text-[10px] px-2 py-1 rounded-full border border-cyan-400/25">Admin Provided</span> <Download size={14} /></button>
                <button className="w-full h-10 rounded-xl border border-cyan-400/30 text-cyan-200 flex items-center justify-between px-3">Rotational Index File <span className="text-[10px] px-2 py-1 rounded-full border border-cyan-400/25">Admin Provided</span> <Download size={14} /></button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-4">
          <article className="glass-card p-6 text-center border-cyan-400/35">
            <div className="text-cyan-200 text-3xl employee-heading">✦ Case Complete!</div>
            <p className="text-slate-300 mt-2">Implant alignment analysis ready</p>
          </article>

          <article className="glass-card p-4">
            <h3 className="employee-heading text-slate-100">Case Summary</h3>
            <p className="text-slate-300 mt-2">Patient: {patient.fullName || 'N/A'} · Age: {patient.age || 'N/A'} · Case ID: {patient.caseRef}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTeeth.map((tooth) => <span key={tooth} className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs">{tooth}</span>)}
            </div>
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="glass-card p-4 border-cyan-400/40">
              <h4 className="employee-heading text-slate-100">Angulation & Analysis Report</h4>
              <p className="text-sm text-slate-300 mt-1">Insertion angles, tolerance, min angle</p>
              <button className="gradient-btn h-10 w-full mt-4 text-slate-950 font-semibold">Download PDF</button>
            </article>
            <article className="glass-card p-4 border-violet-400/40">
              <h4 className="employee-heading text-slate-100">Case Summary Report</h4>
              <p className="text-sm text-slate-300 mt-1">Patient info, scan body, analog, full details</p>
              <button className="h-10 w-full mt-4 rounded-full bg-violet-500/30 border border-violet-400/40 text-violet-100">Download PDF</button>
            </article>
          </div>

          <button className="h-10 px-5 rounded-full border border-cyan-400/35 text-cyan-200">Save Case to Dashboard</button>
        </section>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="h-10 px-5 rounded-full border border-slate-600 text-slate-300 disabled:opacity-40"
        >
          Back
        </button>

        {step === 2 ? (
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">
              <span className={upload ? 'text-emerald-300' : 'text-slate-500'}>☑ Scan file uploaded</span>{' · '}
              <span className={selectedTeeth.length > 0 ? 'text-emerald-300' : 'text-slate-500'}>☑ Teeth selected</span>{' · '}
              <span className={allAssigned ? 'text-emerald-300' : 'text-slate-500'}>☑ All teeth assigned ({Object.keys(toothAssignments).length} of {selectedTeeth.length})</span>
            </div>
            <button
              title={!upload ? 'Please upload a scan file to continue' : ''}
              type="button"
              disabled={!canGoToStep3}
              onClick={next}
              className="h-10 px-5 rounded-full bg-slate-700 text-slate-300 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {!canGoToStep3 ? <Lock size={14} /> : <FileUp size={14} />}
              Next Step →
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={(step === 3 && !superimposed) || step === 5}
            className="gradient-btn h-10 px-6 text-slate-950 font-semibold disabled:opacity-40 inline-flex items-center gap-2"
          >
            {step === 5 ? <Trash2 size={14} /> : <Sparkles size={14} />}
            {step === 5 ? 'Completed' : 'Next Step →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeNewCase;
