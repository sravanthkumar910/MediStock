import { Check, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import { useData } from "../context/DataContext";

const ROLE_TONE = {
  Admin: "bg-crit-light text-crit",
  Pharmacist: "bg-primary-light text-primary",
  Staff: "bg-info-light text-info",
};

export default function Users() {
  const { users, inviteUser, updateUserRole, updateUserStatus } = useData();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Staff", temporaryPassword: "" });
  const [error, setError] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [savingUser, setSavingUser] = useState(null);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submitInvite = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await inviteUser(form);
      setCreatedPassword(result.temporaryPassword);
      setForm({ name: "", email: "", phone: "", role: "Staff", temporaryPassword: "" });
    } catch (inviteError) {
      setError(inviteError.response?.data?.message || inviteError.message || "Could not invite user.");
    }
  };

  const changeRole = async (user, role) => {
    setSavingUser(`${user.id}-role`);
    try {
      await updateUserRole(user.id, role);
    } catch (updateError) {
      setError(updateError.response?.data?.message || updateError.message || "Could not update user role.");
    } finally {
      setSavingUser(null);
    }
  };

  const changeStatus = async (user) => {
    setSavingUser(`${user.id}-status`);
    try {
      await updateUserStatus(user.id, user.status !== "Active");
    } catch (updateError) {
      setError(updateError.response?.data?.message || updateError.message || "Could not update user status.");
    } finally {
      setSavingUser(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Users &amp; roles</h2>
          <p className="text-sm text-muted">{users.length} accounts · Admin, Pharmacist, Staff</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="focus-ring flex items-center gap-1.5 rounded bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus size={15} /> Invite user
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-light font-display text-xs font-semibold text-primary">
                      {u.name.slice(0, 1)}
                    </span>
                    <span className="font-medium text-ink">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={savingUser === `${u.id}-role`}
                    onChange={(event) => changeRole(u, event.target.value)}
                    className="focus-ring rounded border border-line bg-surface px-2 py-1 text-xs font-medium text-ink"
                    aria-label={`Change role for ${u.name}`}
                  >
                    <option>Admin</option>
                    <option>Pharmacist</option>
                    <option>Staff</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.status === "Active" ? "bg-ok-light text-ok" : "bg-bg text-muted"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => changeStatus(u)}
                    disabled={savingUser === `${u.id}-status`}
                    className="focus-ring inline-flex items-center gap-1 rounded border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-bg disabled:opacity-50"
                  >
                    {savingUser === `${u.id}-status` ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                    {u.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite a user">
        <form onSubmit={submitInvite} className="space-y-4">
          {createdPassword && <p className="rounded bg-ok-light px-3 py-2 text-xs text-ok">User created. Temporary password: <strong className="font-mono">{createdPassword}</strong></p>}
          {error && <p className="rounded bg-crit-light px-3 py-2 text-xs text-crit">{error}</p>}
          <Field label="Full name"><input required value={form.name} onChange={update("name")} className={inputClass} /></Field>
          <Field label="Email"><input required type="email" value={form.email} onChange={update("email")} className={inputClass} /></Field>
          <Field label="Phone (optional)"><input type="tel" value={form.phone} onChange={update("phone")} className={inputClass} /></Field>
          <Field label="Role"><select value={form.role} onChange={update("role")} className={inputClass}><option>Staff</option><option>Pharmacist</option><option>Admin</option></select></Field>
          <Field label="Temporary password"><input required minLength={6} value={form.temporaryPassword} onChange={update("temporaryPassword")} className={inputClass} /></Field>
          <div className="flex justify-end gap-2 border-t border-line pt-4"><button type="button" onClick={() => setInviteOpen(false)} className="rounded border border-line px-4 py-2 text-sm">Cancel</button><button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white">Create user</button></div>
        </form>
      </Modal>
    </div>
  );
}

const inputClass = "focus-ring w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink";

function Field({ label, children }) {
  return <label className="block text-xs font-medium text-ink">{label}<span className="mt-1.5 block">{children}</span></label>;
}
