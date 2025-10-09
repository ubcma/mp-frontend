import MemberDemographics from '@/components/dashboard/MemberDemographics';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { SectionCards } from '@/components/dashboard/SectionCards';
import TransactionsTable from '@/components/dashboard/TransactionsTable';

export default function Home() {
  return (
    <div className="space-y-4 max-w-full">
      <SectionCards />
      <RevenueChart />
      <MemberDemographics />
    </div>
  );
}
