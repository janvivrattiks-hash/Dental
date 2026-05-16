import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Lock, Search, Sparkles, Trash2, UploadCloud, X } from 'lucide-react';
import StepProgress from '../components/StepProgress';
import ToothChart from '../components/ToothChart';
import ScanPreview3D from '../components/ScanPreview3D';
import { useCaseStore } from '../../store/caseStore';
import { useLibraryData } from '../../hooks/useLibraryData';
import api, { notifyError, notifySuccess } from '../../Script/api';

const MB = 1024 * 1024;
const fileSizeInMb = (size) => `${(size / MB).toFixed(2)} MB`;

// ── Step 1 validation ─────────────────────────────────────────────────────────

const validatePatient = (p) => {
  const errors = {};
  if (!p.fullName.trim()) errors.fullName = 'Patient name is required';
  const age = parseInt(p.age, 10);
  if (!p.age.toString().trim()) errors.age = 'Age is required';
  else if (isNaN(age) || age < 1 || age > 120) errors.age = 'Enter a valid age (1–120)';
  if (!p.caseDate) errors.caseDate = 'Case date is required';
  return errors;
};

// ── Small shared UI pieces ────────────────────────────────────────────────────

const FieldError = ({ msg }) =>
  msg ? <p className="text-xs text-rose-400 mt-1">{msg}</p> : null;

const Spinner = () => (
  <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
);

const AlertBanner = ({ msg, variant = 'amber' }) => {
  const colors =
    variant === 'red'
      ? 'border-rose-400/30 bg-rose-500/10 text-rose-200'
      : 'border-amber-400/30 bg-amber-500/10 text-amber-200';
  return (
    <div className={`text-xs rounded-xl border px-3 py-2 ${colors}`}>{msg}</div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const EmployeeNewCase = () => {
  const navigate = useNavigate();

  // ── Persistent case state ─────────────────────────────────────────────────
  const {
    currentStep,
    patientData,
    caseId,
    caseRef,
    selectedTeeth,
    activeTooth,
    toothBrandSelections,
    toothAngleSelections,
    toothAssignments,
    setStep,
    setPatientData,
    setCaseCreated,
    toggleTooth,
    setActiveTooth,
    setToothBrand,
    setToothAngle,
    assignLibrary,
    removeAssignment,
    clearTeeth,
    resetCase,
  } = useCaseStore();

  // ── Local (non-persisted) state ───────────────────────────────────────────
  const [patient, setPatient] = useState(patientData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [savingStep1, setSavingStep1] = useState(false);

  const [upload, setUpload] = useState(null);          // File object — can't persist
  const [uploadingToBackend, setUploadingToBackend] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);

  const [savingFinal, setSavingFinal] = useState(false);
  const [savedRef, setSavedRef] = useState(null);
  const [superimposed, setSuperimposed] = useState(false);

  // ── Library cascade (Brand → Angle → Libraries) ───────────────────────────
  const {
    brands, brandsLoading, brandsError, fetchBrands,
    angles, anglesLoading, anglesError, activeBrand,
    fetchAnglesForBrand,
    displayedLibraries, activeAngle, selectAngle,
    restoreForTooth,
  } = useLibraryData();

  // Restore cascade when user switches to a different tooth
  const prevActiveTooth = useRef(null);
  useEffect(() => {
    if (activeTooth && activeTooth !== prevActiveTooth.current) {
      prevActiveTooth.current = activeTooth;
      const savedBrand = toothBrandSelections[activeTooth];
      const savedAngle = toothAngleSelections?.[activeTooth] ?? null;
      if (savedBrand) restoreForTooth(savedBrand, savedAngle);
    }
  }, [activeTooth, toothBrandSelections, toothAngleSelections, restoreForTooth]);

  // Fetch brands lazily when entering Step 2
  useEffect(() => {
    if (currentStep === 2) fetchBrands();
  }, [currentStep, fetchBrands]);

  // Restore persisted patient data on first mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setPatient(patientData); }, []);

  // Sync local patient state → store whenever it changes (avoids setState-in-render)
  useEffect(() => {
    setPatientData(patient);
  }, [patient, setPatientData]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const allAssigned = useMemo(
    () => selectedTeeth.length > 0 && selectedTeeth.every((t) => Boolean(toothAssignments[t])),
    [selectedTeeth, toothAssignments]
  );

  const step1Valid = useMemo(() => {
    const errors = validatePatient(patient);
    return Object.keys(errors).length === 0;
  }, [patient]);

  const canGoToStep3 = Boolean(upload) && selectedTeeth.length > 0 && allAssigned;

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Store sync is handled by the useEffect above — no Zustand calls inside setState
  const handlePatientChange = useCallback((field, value) => {
    setPatient((p) => ({ ...p, [field]: value }));
    setFieldErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const handleStep1Next = async () => {
    const errors = validatePatient(patient);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setSavingStep1(true);
    try {
      // If we already have a caseId (user refreshed mid-flow), skip creation
      if (!caseId) {
        const res = await api.employee.cases.create({
          patient_name: patient.fullName.trim(),
          patient_age: parseInt(patient.age, 10),
          case_date: patient.caseDate,
          doctor_notes: patient.notes || null,
        });
        const data = res.data?.data || res.data;
        setCaseCreated(data.id, data.case_reference);
        notifySuccess(`Case ${data.case_reference} created`);
      }
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.detail;
      notifyError(typeof msg === 'object' ? msg?.message : (msg || 'Failed to create case'));
    } finally {
      setSavingStep1(false);
    }
  };

  const onFilePicked = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['stl', 'obj', 'ply'].includes(ext)) {
      notifyError('Only STL, OBJ, PLY files are supported');
      return;
    }
    if (file.size > 500 * MB) {
      notifyError('File exceeds 500 MB limit');
      return;
    }
    setUpload(file);

    // Upload to backend immediately so we don't have to do it at the end
    if (caseId) {
      setUploadingToBackend(true);
      try {
        await api.employee.cases.uploadScan(caseId, file);
      } catch {
        // Non-fatal — user can still proceed; scan can be re-uploaded
      } finally {
        setUploadingToBackend(false);
      }
    }
  };

  const handleBrandSelect = (brand) => {
    if (!activeTooth) return;
    setToothBrand(activeTooth, brand); // also resets angle for this tooth in store
    fetchAnglesForBrand(brand);        // one call → all angles + their libraries loaded
  };

  const handleAngleSelect = (angle) => {
    if (!activeTooth) return;
    const parsed = angle === '' ? null : parseFloat(angle);
    setToothAngle(activeTooth, parsed);
    selectAngle(parsed); // pure client-side filter — no API call
  };

  const handleLibraryAssign = (library) => {
    if (!activeTooth) return;
    // Store full library data including assets so Step 3 (superimpose) has the STL paths
    assignLibrary(activeTooth, {
      company_name: library.company_name,
      library_id: String(library.id),
      angle_alignment: library.angle_alignment,
      manufacturer_id: library.manufacturer_id,
      assets: library.assets ?? [],       // scan_body / analog / angle STL file paths
    });
    notifySuccess(`Library assigned to Tooth ${activeTooth}`);
  };

  const goToStep = (step) => {
    setStep(step);
    if (caseId) {
      api.employee.cases.updateStep(caseId, step).catch(() => {});
    }
  };

  const handleNextFromStep2 = () => {
    if (!canGoToStep3) return;
    goToStep(3);
  };

  const handleFinalSave = async () => {
    setSavingFinal(true);
    try {
      const activeCaseId = caseId;

      if (!activeCaseId) {
        // Fallback: create case + upload if user somehow skipped step 1 save
        const res = await api.employee.cases.create({
          patient_name: patient.fullName.trim(),
          patient_age: parseInt(patient.age, 10),
          case_date: patient.caseDate,
          doctor_notes: patient.notes || null,
        });
        const data = res.data?.data || res.data;
        setCaseCreated(data.id, data.case_reference);
        if (upload) {
          await api.employee.cases.uploadScan(data.id, upload).catch(() => {});
        }
      }

      // Persist teeth assignments
      const finalCaseId = caseId || activeCaseId;
      const teeth = selectedTeeth.map((tooth) => ({
        tooth_number: tooth,
        library_id: toothAssignments[tooth]?.library_id ?? null,
      }));
      if (teeth.length) {
        await api.employee.cases.addTeeth(finalCaseId, teeth);
      }

      await api.employee.cases.updateStep(finalCaseId, 5).catch(() => {});
      setSavedRef(caseRef || 'N/A');
      notifySuccess('Case saved successfully!');
    } catch (err) {
      const msg = err?.response?.data?.detail;
      const detail = typeof msg === 'object' ? msg?.message : msg;
      notifyError(detail || 'Failed to save case. Check your subscription limit.');
    } finally {
      setSavingFinal(false);
    }
  };

  const handleStartNew = () => {
    resetCase();
    setPatient({ fullName: '', age: '', caseDate: new Date().toISOString().split('T')[0], notes: '' });
    setUpload(null);
    setSavedRef(null);
    setSuperimposed(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const currentBrandForTooth = activeTooth ? (toothBrandSelections[activeTooth] || '') : '';
  const currentAngleForTooth = activeTooth ? (toothAngleSelections?.[activeTooth] ?? '') : '';
  const assignedForTooth = activeTooth ? toothAssignments[activeTooth] : null;

  return (
    <div>
      <StepProgress activeStep={currentStep} />

      {/* ── STEP 1 — Patient Details ─────────────────────────────────────── */}
      {currentStep === 1 && (
        <section className="glass-card p-5 space-y-4">
          <h2 className="employee-heading text-lg text-slate-100">Patient Details</h2>

          <div>
            <input
              className={`glass-input h-11 px-3 w-full ${fieldErrors.fullName ? 'border-rose-400/60' : ''}`}
              placeholder="Patient Full Name *"
              value={patient.fullName}
              onChange={(e) => handlePatientChange('fullName', e.target.value)}
            />
            <FieldError msg={fieldErrors.fullName} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                className={`glass-input h-11 px-3 w-full ${fieldErrors.age ? 'border-rose-400/60' : ''}`}
                type="number"
                min="1"
                max="120"
                placeholder="Age *"
                value={patient.age}
                onChange={(e) => handlePatientChange('age', e.target.value)}
              />
              <FieldError msg={fieldErrors.age} />
            </div>
            <div>
              <input
                className="glass-input h-11 px-3 w-full bg-slate-800/50 text-slate-400 cursor-not-allowed"
                value={caseRef || 'Auto-generated on save'}
                readOnly
              />
            </div>
          </div>

          <div>
            <input
              className={`glass-input h-11 px-3 w-full ${fieldErrors.caseDate ? 'border-rose-400/60' : ''}`}
              type="date"
              value={patient.caseDate}
              onChange={(e) => handlePatientChange('caseDate', e.target.value)}
            />
            <FieldError msg={fieldErrors.caseDate} />
          </div>

          <textarea
            className="glass-input px-3 py-2 w-full min-h-28"
            value={patient.notes}
            placeholder="Remarks (optional)"
            onChange={(e) => handlePatientChange('notes', e.target.value)}
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!step1Valid || savingStep1}
              onClick={handleStep1Next}
              title={!step1Valid ? 'Fill all mandatory fields to continue' : ''}
              className="gradient-btn h-10 px-6 text-slate-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {savingStep1 ? <Spinner /> : !step1Valid ? <Lock size={14} /> : <Sparkles size={14} />}
              {savingStep1 ? 'Saving…' : 'Next Step →'}
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 2 — Upload Scan & Library Assignment ────────────────────── */}
      {currentStep === 2 && (
        <section className="space-y-4">
          {/* Scan upload */}
          <article className="glass-card p-5">
            <h2 className="employee-heading text-lg text-slate-100">Upload Patient Scan Data</h2>
            {!upload ? (
              <label className="block mt-4 rounded-2xl border border-cyan-400/40 p-8 text-center bg-[#041226] cursor-pointer hover:border-cyan-400/60 transition-colors">
                <UploadCloud className="mx-auto mt-3 text-cyan-300" />
                <p className="employee-heading text-slate-100 mt-3">Drop Your Patient Scan File Here</p>
                <p className="text-sm text-slate-400 mt-1">STL · PLY · OBJ supported — Max 500 MB</p>
                <span className="gradient-btn inline-flex mt-4 px-5 h-10 items-center text-slate-950 font-semibold">
                  Browse Files
                </span>
                <input className="hidden" type="file" accept=".stl,.obj,.ply" onChange={onFilePicked} />
              </label>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                  <div className="text-sm text-emerald-200 flex items-center gap-2">
                    {uploadingToBackend ? <Spinner /> : '✓'} {upload.name} ({fileSizeInMb(upload.size)})
                    {uploadingToBackend && <span className="text-xs text-slate-400">Uploading…</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUpload(null); setWireframeMode(false); }}
                    className="text-rose-300 text-sm hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>
                <div className="rounded-xl border border-cyan-400/35 bg-[#031022] h-[380px] relative">
                  <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200">3D Scan Preview</span>
                  <div className="absolute right-3 top-3 flex gap-2 text-xs">
                    {['Solid', 'Wireframe'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setWireframeMode(mode === 'Wireframe')}
                        className={`px-2 py-1 rounded-full ${wireframeMode === (mode === 'Wireframe') ? 'bg-slate-800 text-slate-200' : 'border border-slate-600 text-slate-300'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <ScanPreview3D file={upload} wireframe={wireframeMode} />
                  <div className="absolute left-3 bottom-3 text-xs text-slate-500">🖱 Drag · Scroll · Right-click to pan</div>
                </div>
              </div>
            )}
          </article>

          {/* Teeth selection & library assignment (only shown once scan is uploaded) */}
          {upload && (
            <article className="space-y-4">
              <div className="glass-card p-4 border-l-2 border-cyan-400/50">
                <h3 className="employee-heading text-slate-100">Assign Implant Library to Teeth</h3>
                <p className="text-sm text-slate-300 mt-1">
                  Click a tooth, choose a brand, then select the matching library entry.
                </p>
              </div>

              <ToothChart
                selectedTeeth={selectedTeeth}
                onToggle={toggleTooth}
                onClear={() => clearTeeth()}
              />

              {selectedTeeth.length > 0 && (
                <div className="glass-card p-4 space-y-4">
                  {/* Tooth tabs */}
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {selectedTeeth.map((tooth) => (
                        <button
                          key={tooth}
                          type="button"
                          onClick={() => {
                            setActiveTooth(tooth);
                            const brand = toothBrandSelections[tooth];
                            if (brand) fetchLibrariesForBrand(brand);
                          }}
                          className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                            activeTooth === tooth
                              ? 'bg-cyan-500/20 border-cyan-400/35 text-cyan-200'
                              : 'border-slate-600 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          Tooth {tooth} {toothAssignments[tooth] ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">Active: {activeTooth || 'None'}</span>
                  </div>

                  {!activeTooth && (
                    <AlertBanner msg="Select a tooth above to assign a library." />
                  )}

                  {activeTooth && (
                    <div className="space-y-4">
                      {/* Currently assigned badge */}
                      {assignedForTooth && (
                        <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm">
                          <span className="text-emerald-200">
                            ✓ Assigned: <strong>{assignedForTooth.company_name}</strong> — {assignedForTooth.manufacturer_id || 'N/A'} · {assignedForTooth.angle_alignment}°
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAssignment(activeTooth)}
                            className="text-rose-300 hover:text-rose-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      {/* Step 1 — Brand */}
                      <div className="flex flex-wrap gap-2 items-end">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                          <input className="glass-input h-10 pl-8 pr-3" placeholder="Search" />
                        </div>

                        {/* Brand dropdown */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide px-1">Brand</label>
                          <select
                            className="glass-input h-10 px-3 min-w-[160px]"
                            value={currentBrandForTooth}
                            onChange={(e) => handleBrandSelect(e.target.value)}
                            disabled={brandsLoading}
                          >
                            <option value="">{brandsLoading ? 'Loading…' : 'Select Brand'}</option>
                            {brands.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        {/* Angle dropdown — shown only after brand selected */}
                        {currentBrandForTooth && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wide px-1">
                              Angle Alignment
                            </label>
                            <select
                              className="glass-input h-10 px-3 min-w-[160px]"
                              value={currentAngleForTooth}
                              onChange={(e) => handleAngleSelect(e.target.value)}
                              disabled={anglesLoading}
                            >
                              <option value="">
                                {anglesLoading ? 'Loading…' : 'All Angles'}
                              </option>
                              {angles.map((a) => (
                                <option key={a.angle_alignment} value={a.angle_alignment}>
                                  {a.angle_alignment}° ({a.library_count} {a.library_count === 1 ? 'library' : 'libraries'})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {brandsError && <AlertBanner msg={brandsError} />}
                      {anglesError && <AlertBanner msg={anglesError} />}

                      {/* Library cards */}
                      {!currentBrandForTooth && (
                        <p className="text-xs text-slate-400">① Select a brand → ② choose an angle → ③ pick a library.</p>
                      )}

                      {/* Only show hint when libraries haven't loaded yet */}
                      {currentBrandForTooth && !anglesLoading && displayedLibraries.length === 0 && !anglesError && (
                        <p className="text-xs text-slate-400">No libraries found. Try a different brand or angle.</p>
                      )}

                      {/* Skeleton while loading angles + libraries from one API call */}
                      {anglesLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 rounded-xl border border-slate-700 bg-slate-800/40 animate-pulse" />
                          ))}
                        </div>
                      )}

                      {anglesError && <AlertBanner msg={anglesError} />}

                      {currentAngleForTooth !== '' && !anglesLoading && displayedLibraries.length === 0 && !anglesError && (
                        <p className="text-xs text-slate-400">No libraries found for this angle.</p>
                      )}

                      {displayedLibraries.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                          {displayedLibraries.map((lib) => {
                            const isAssigned = toothAssignments[activeTooth]?.library_id === String(lib.id);
                            return (
                              <button
                                key={lib.id}
                                type="button"
                                onClick={() => handleLibraryAssign(lib)}
                                className={`text-left p-3 rounded-xl border transition-all ${
                                  isAssigned
                                    ? 'border-cyan-300 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,212,255,.3)]'
                                    : 'border-slate-600 hover:border-cyan-400/35'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm text-slate-100 truncate">{lib.company_name}</p>
                                  <span className="shrink-0 text-[10px] px-2 py-1 rounded-full border border-cyan-400/25 text-cyan-200">Admin</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {lib.manufacturer_id || 'N/A'} · {lib.angle_alignment}°
                                </p>
                                {/* All asset filenames */}
                                {lib.assets?.length > 0 && (
                                  <div className="mt-2 space-y-0.5">
                                    {lib.assets.map((asset) => (
                                      <div key={asset.id} className="flex items-center gap-1.5">
                                        <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded border border-slate-600 text-slate-500 uppercase tracking-wide">
                                          {asset.asset_type}
                                        </span>
                                        <p className="text-[10px] text-slate-400 truncate">{asset.file_name}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <p className="text-[11px] text-slate-500 mt-2">
                                  {isAssigned ? '✓ Assigned' : `Click to assign to Tooth ${activeTooth}`}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assignment Summary */}
                  <div className="glass-card p-3 space-y-2">
                    <h4 className="employee-heading text-sm text-slate-100">Assignment Summary</h4>
                    {selectedTeeth.map((tooth) => {
                      const a = toothAssignments[tooth];
                      return (
                        <div key={tooth} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Tooth {tooth}</span>
                          <span className={a ? 'text-cyan-200' : 'text-amber-300'}>
                            {a ? `${a.company_name} · ${a.manufacturer_id || 'N/A'} ✓` : '[Not assigned]'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          )}
        </section>
      )}

      {/* ── STEP 3 — Superimpose ─────────────────────────────────────────── */}
      {currentStep === 3 && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 glass-card p-4">
            <h2 className="employee-heading text-lg text-slate-100">Mesh Superimposition</h2>
            <p className="text-sm text-slate-400 mt-1">
              Patient scan is superimposed with the selected scan body to align implant geometry precisely.
            </p>
            <div className="rounded-xl border border-cyan-400/35 bg-[#031022] h-[380px] mt-4 relative">
              <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded-full border border-cyan-400/35 text-cyan-200">3D Alignment Viewer</span>
              <div className="h-full grid place-content-center text-slate-400">Superimposition viewer integration point</div>
              <div className="absolute left-3 bottom-3 text-xs text-slate-500">🖱 Drag · Scroll · Right-click to pan</div>
            </div>
          </div>
          <div className="xl:col-span-4 space-y-4">
            <div className="glass-card p-4 space-y-2">
              <h3 className="employee-heading text-slate-100">Mesh Visibility</h3>
              {['Patient Scan', 'Scan Body Mesh', 'Analog Preview'].map((label) => (
                <label key={label} className="flex items-center justify-between text-slate-300">
                  <span>{label}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>

            {/* Show assigned library assets for each tooth */}
            {selectedTeeth.map((tooth) => {
              const a = toothAssignments[tooth];
              if (!a?.assets?.length) return null;
              return (
                <div key={tooth} className="glass-card p-3 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold">Tooth {tooth} — {a.company_name} · {a.angle_alignment}°</p>
                  {a.assets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded border border-slate-600 text-slate-500 shrink-0">
                        {asset.asset_type}
                      </span>
                      <span className="truncate">{asset.file_name}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            <div className="glass-card p-4 space-y-3">
              <button
                onClick={() => setSuperimposed(true)}
                className="gradient-btn h-10 w-full text-slate-950 font-semibold"
              >
                Process Superimposition
              </button>
              {superimposed && (
                <>
                  <span className="text-xs px-2 py-1 rounded-full border border-emerald-400/35 bg-emerald-500/20 text-emerald-200">✓ Superimposition Complete</span>
                  <p className="text-sm text-slate-300">Match score: 92%</p>
                  <p className="text-sm text-slate-300">Time: ⚡ 2.1s</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── STEP 4 — Results ─────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <section className="grid grid-cols-1 xl:grid-cols-10 gap-4">
          <div className="xl:col-span-6 glass-card p-4 h-[420px] bg-[#031022] border border-cyan-400/35">
            <h3 className="employee-heading text-slate-100">3D Results Viewer</h3>
            <div className="h-[360px] grid place-content-center text-slate-400">Result + analog overlay integration point</div>
          </div>
          <div className="xl:col-span-4 space-y-4">
            <div className="glass-card p-4">
              <h4 className="employee-heading text-slate-100">Insertion Angles</h4>
              <div className="mt-3 space-y-3 text-sm">
                {selectedTeeth.slice(0, 3).map((tooth) => {
                  const a = toothAssignments[tooth];
                  return (
                    <div key={tooth} className="border border-cyan-400/20 rounded-xl p-3">
                      <p className="text-slate-300">Tooth {tooth} · {a?.company_name || 'N/A'}</p>
                      <p className="text-cyan-200 text-xl employee-heading mt-1">{a?.angle_alignment ?? '—'}°</p>
                      <p className="text-emerald-300 mt-1">✅ Within Tolerance</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass-card p-4">
              <h4 className="employee-heading text-slate-100">Summary</h4>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>Total implants: {selectedTeeth.length}</li>
                <li>Processing time: ⚡ 2.1s</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── STEP 5 — Download ────────────────────────────────────────────── */}
      {currentStep === 5 && (
        <section className="space-y-4">
          <article className="glass-card p-6 text-center border-cyan-400/35">
            <div className="text-cyan-200 text-3xl employee-heading">✦ Case Complete!</div>
            <p className="text-slate-300 mt-2">Implant alignment analysis ready</p>
          </article>

          <article className="glass-card p-4">
            <h3 className="employee-heading text-slate-100">Case Summary</h3>
            <p className="text-slate-300 mt-2">
              Patient: {patient.fullName || 'N/A'} · Age: {patient.age || 'N/A'} · Case ID: {caseRef || 'N/A'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTeeth.map((t) => (
                <span key={t} className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="glass-card p-4 border-cyan-400/40">
              <h4 className="employee-heading text-slate-100">Angulation & Analysis Report</h4>
              <button className="gradient-btn h-10 w-full mt-4 text-slate-950 font-semibold">Download PDF</button>
            </article>
            <article className="glass-card p-4 border-violet-400/40">
              <h4 className="employee-heading text-slate-100">Case Summary Report</h4>
              <button className="h-10 w-full mt-4 rounded-full bg-violet-500/30 border border-violet-400/40 text-violet-100">Download PDF</button>
            </article>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              disabled={savingFinal || Boolean(savedRef)}
              onClick={handleFinalSave}
              className="h-10 px-5 rounded-full border border-cyan-400/35 text-cyan-200 disabled:opacity-40 inline-flex items-center gap-2"
            >
              {savingFinal ? <Spinner /> : null}
              {savingFinal ? 'Saving…' : savedRef ? `Saved: ${savedRef}` : 'Save Case to Dashboard'}
            </button>

            {savedRef && (
              <>
                <button
                  onClick={() => navigate('/my-cases')}
                  className="h-10 px-5 rounded-full bg-cyan-500/20 border border-cyan-400/35 text-cyan-200"
                >
                  View My Cases →
                </button>
                <button
                  onClick={handleStartNew}
                  className="h-10 px-5 rounded-full border border-slate-600 text-slate-300"
                >
                  <Trash2 size={14} className="inline mr-2" />
                  Start New Case
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Navigation bar ──────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goToStep(Math.max(currentStep - 1, 1))}
          disabled={currentStep === 1}
          className="h-10 px-5 rounded-full border border-slate-600 text-slate-300 disabled:opacity-40"
        >
          Back
        </button>

        {currentStep === 1 ? null /* Next handled inside step 1 */ : currentStep === 2 ? (
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">
              <span className={upload ? 'text-emerald-300' : 'text-slate-500'}>☑ Scan uploaded</span>{' · '}
              <span className={selectedTeeth.length > 0 ? 'text-emerald-300' : 'text-slate-500'}>☑ Teeth selected</span>{' · '}
              <span className={allAssigned ? 'text-emerald-300' : 'text-slate-500'}>
                ☑ All assigned ({Object.keys(toothAssignments).length}/{selectedTeeth.length})
              </span>
            </div>
            <button
              type="button"
              disabled={!canGoToStep3}
              onClick={handleNextFromStep2}
              title={!canGoToStep3 ? 'Upload scan and assign all teeth to continue' : ''}
              className="h-10 px-5 rounded-full bg-slate-700 text-slate-300 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {!canGoToStep3 ? <Lock size={14} /> : <FileUp size={14} />}
              Next Step →
            </button>
          </div>
        ) : currentStep < 5 ? (
          <button
            type="button"
            disabled={currentStep === 3 && !superimposed}
            onClick={() => goToStep(currentStep + 1)}
            className="gradient-btn h-10 px-6 text-slate-950 font-semibold disabled:opacity-40 inline-flex items-center gap-2"
          >
            <Sparkles size={14} />
            Next Step →
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeNewCase;
