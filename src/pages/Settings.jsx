import { User, Shield, Bell, Globe, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Settings = () => {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-black text-slate-800">Clinic <span className="text-clinical-blue underline decoration-clinical-blue/20 underline-offset-8">Settings</span></h1>
                <p className="text-slate-500 mt-2 font-medium">Configure your clinic profile, availability, and system preferences.</p>
            </div>

            <div className="space-y-6">
                <Card title="Clinic Profile" subtitle="Public information about your dental practice">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Clinic Name" defaultValue="Dental Path Clinic" />
                        <Input label="Email Address" defaultValue="contact@dentalpath.com" type="email" />
                        <Input label="Phone Number" defaultValue="+1 (205) 555-0100" />
                        <Input label="Website" defaultValue="www.dentalpath.com" />
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 mb-1.5 block">Full Address</label>
                            <textarea
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm transition-all focus:border-clinical-blue focus:ring-4 focus:ring-clinical-blue/10 min-h-[100px] outline-none"
                                defaultValue="123 Dental Street, Medical Plaza, Suite 404, New York, NY"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <Button className="gap-2 px-8">
                            <Save size={18} />
                            Save Changes
                        </Button>
                    </div>
                </Card>

                <Card title="Security & Authentication" subtitle="Manage your account access and passwords">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-clinical-blue/10 text-clinical-blue rounded-lg"><Shield size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account</p>
                                </div>
                            </div>
                            <Badge variant="success">Enabled</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <Input label="New Password" type="password" placeholder="••••••••" />
                            <Input label="Confirm Password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="outline">Update Password</Button>
                        </div>
                    </div>
                </Card>

                <Card title="Notification Preferences">
                    <div className="space-y-4 font-semibold text-slate-700">
                        {[
                            { id: 'app', label: 'In-app notifications', desc: 'Alerts for new appointments and messages' },
                            { id: 'email', label: 'Email alerts', desc: 'Summary of daily schedule and billing reports' },
                            { id: 'sms', label: 'SMS reminders', desc: 'Automatic reminders sent to patient phones' },
                        ].map(item => (
                            <label key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                                <input type="checkbox" defaultChecked={item.id !== 'sms'} className="mt-1.5 h-4 w-4 rounded border-slate-300 text-clinical-blue focus:ring-clinical-blue" />
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-clinical-blue transition-colors">{item.label}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
