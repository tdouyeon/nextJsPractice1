import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '../lib/data';

 
export default async function Page() {
  // 이렇게 하면 fetchRevenue() -> fetchLatestInvoices() -> fetchCardData() 순서대로 실행됨: request waterfall 
  // 이걸 고치려면 아래 주석 확인
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } = await fetchCardData();
    console.log(revenue,"RevenueChart")
    // 아래와 같이 하면 함수를 병렬로 실행하고 모든 비동기 작업이 완료될 때까지 기다린 후 데이터를 사용함, 성능 향상 대신 가독성 측면에서 떨어질 수 잇음
    // export async function fetchCardData() {
    //   try {
    //     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    //     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    //     const invoiceStatusPromise = sql`SELECT
    //          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //          FROM invoices`;
     
    //     const {revenue,latestInvoices, { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } } = await Promise.all([
    //       invoiceCountPromise,
    //       customerCountPromise,
    //       invoiceStatusPromise,
    //     ]);
    //     // ...
    //   }
    // }
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}