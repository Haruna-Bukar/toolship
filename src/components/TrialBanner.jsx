import { useState } from "react";

export default function TrialBanner({ daysLeft = 30 }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-violet/20 px-4 py-2 text-sm">
      <span>You have {daysLeft} days left in free trial on Toolship</span>
      <button className="rounded-md bg-violet px-3 py-1 text-xs font-semibold hover:opacity-90">
        Upgrade to Pro
      </button>
      <button onClick={() => setVisible(false)} className="text-xs text-white/60 hover:text-white">
        Dismiss
      </button>
    </div>
  );
}
