import { redirect } from 'next/navigation';

export default function LegacyBooksManagementPage() {
    redirect('/admin/books');
}
