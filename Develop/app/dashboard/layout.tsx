import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div >{children}</div>
    </div>
  );
}