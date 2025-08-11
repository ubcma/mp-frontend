export function AuthPageGradient() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-auth-background animate-[gradient-shift_1s_ease-in-out_infinite]"></div>
    </div>
  );
}

export function MainDashboardGradient() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-main-background animate-[gradient-shift_1s_ease-in-out_infinite] opacity-10"></div>
    </div>
  );
}

