import { Calendar as CalendarIcon, List, Plus, ChevronLeft, ChevronRight, Clock, User, Stethoscope } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useState } from 'react';

const Appointments = () => {
    const [view, setView] = useState('list');

    const appointments = [
        { id: 1, patient: 'Darlene Robertson', service: 'Root Canal', time: '09:00 AM', duration: '60 min', status: 'Confirmed', dentist: 'Dr. Jane Smith' },
        { id: 2, patient: 'Arlene McCoy', service: 'Dental Checkup', time: '10:30 AM', duration: '30 min', status: 'Pending', dentist: 'Dr. Mike Ross' },
        { id: 3, patient: 'Edward Steward', service: 'Teeth Whitening', time: '12:00 PM', duration: '45 min', status: 'Confirmed', dentist: 'Dr. Jane Smith' },
        { id: 4, patient: 'Marvin McKinney', service: 'Braces Adjustment', time: '02:30 PM', duration: '30 min', status: 'Cancelled', dentist: 'Dr. Mike Ross' },
        { id: 5, patient: 'Kathryn Murphy', service: 'Cleaning', time: '04:00 PM', duration: '45 min', status: 'Confirmed', dentist: 'Dr. Jane Smith' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Appointment <span className="text-clinical-blue underline decoration-clinical-blue/20 underline-offset-8">Schedule</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your daily and weekly clinical schedule efficiently.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setView('calendar')}
                            className={`p-2 rounded-lg transition-all duration-300 ${view === 'calendar' ? 'bg-clinical-blue text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <CalendarIcon size={20} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-all duration-300 ${view === 'list' ? 'bg-clinical-blue text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <Button variant="primary" className="gap-2 h-12">
                        <Plus size={20} />
                        Book Appointment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Calendar" className="p-0">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-bold text-slate-700">February 2026</span>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-white rounded-md transition-colors"><ChevronLeft size={16} /></button>
                                <button className="p-1 hover:bg-white rounded-md transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-7 gap-1 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-black text-slate-400 uppercase">{d}</span>)}
                            {Array.from({ length: 28 }, (_, i) => (
                                <button key={i} className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${i + 1 === 28 ? 'bg-clinical-blue text-white shadow-lg shadow-clinical-blue/30 scale-110' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card title="Legend">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Confirmed
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Pending
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div> Cancelled
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card title="Appointments List" subtitle={`Today, 28 Feb 2026`}>
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-300 group">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center justify-center w-20 h-20 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                                            <span className="text-xs font-black text-clinical-blue uppercase tracking-tighter">{apt.time.split(' ')[1]}</span>
                                            <span className="text-xl font-black text-slate-800 tracking-tighter">{apt.time.split(' ')[0]}</span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-clinical-blue transition-colors">{apt.patient}</h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm font-semibold text-slate-400 italic">
                                                <span className="flex items-center gap-1.5"><Stethoscope size={14} className="text-clinical-teal" /> {apt.service}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-clinical-blue" /> {apt.duration}</span>
                                                <span className="flex items-center gap-1.5"><User size={14} className="text-slate-300" /> {apt.dentist}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                                        <Badge variant={apt.status === 'Confirmed' ? 'success' : apt.status === 'Pending' ? 'warning' : 'error'}>
                                            {apt.status}
                                        </Badge>
                                        <button className="p-2 text-slate-300 hover:text-clinical-blue hover:bg-white rounded-lg transition-all duration-300 border border-transparent hover:border-slate-100 shadow-sm">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
