import { Search, Filter, Plus, UserPlus, Mail, Phone, MoreVertical } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Patients = () => {
    const patients = [
        { id: 1, name: 'Darlene Robertson', email: 'darlene@example.com', phone: '(205) 555-0100', status: 'Active', lastVisit: '20 Feb 2026' },
        { id: 2, name: 'Arlene McCoy', email: 'arlene@example.com', phone: '(208) 555-0112', status: 'Inactive', lastVisit: '15 Jan 2026' },
        { id: 3, name: 'Edward Steward', email: 'edward@example.com', phone: '(219) 555-0114', status: 'Active', lastVisit: '24 Feb 2026' },
        { id: 4, name: 'Marvin McKinney', email: 'marvin@example.com', phone: '(302) 555-0107', status: 'Active', lastVisit: '22 Feb 2026' },
        { id: 5, name: 'Kathryn Murphy', email: 'murphy@example.com', phone: '(303) 555-0105', status: 'Active', lastVisit: '28 Feb 2026' },
        { id: 6, name: 'Theresa Webb', email: 'webb@example.com', phone: '(406) 555-0120', status: 'Inactive', lastVisit: '05 Dec 2025' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Patients <span className="text-clinical-teal underline decoration-clinical-teal/20 underline-offset-8">Directory</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and view all your patient records in one place.</p>
                </div>
                <Button variant="secondary" className="gap-2 h-12 px-6">
                    <UserPlus size={20} />
                    Add New Patient
                </Button>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Input placeholder="Search name, phone, email..." icon={Search} className="h-12 border-slate-100 bg-slate-50/50" />
                    </div>
                    <Button variant="outline" className="gap-2 h-12 border-slate-100 text-slate-500">
                        <Filter size={18} />
                        Filters
                    </Button>
                </div>

                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-y border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 group-hover:bg-clinical-teal/10 group-hover:text-clinical-teal group-hover:border-clinical-teal/20 transition-all duration-300">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700 tracking-tight">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold italic">
                                            <Mail size={12} className="text-slate-300" />
                                            {patient.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Phone size={12} className="text-slate-300" />
                                            {patient.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={patient.status === 'Active' ? 'success' : 'neutral'}>{patient.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500 font-bold">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors duration-200">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                    <p className="text-sm font-semibold text-slate-400italic">Showing 6 of 1,250 patients</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Patients;
