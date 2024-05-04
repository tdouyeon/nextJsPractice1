'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
  INSERT INTO invoices (customer_id, amount, status, date) 
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

  // revalidatePath를 사용하는 이유는 cache clear ad trigger new request tot the server
  // 참고) nextJs에선 사용자 브라우저에 라우트 세그먼트를 클라이언트 측 캐시에 저장
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
