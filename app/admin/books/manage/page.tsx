import { permanentRedirect } from 'next/navigation';

export default function LegacyManageBooksPage() {
    permanentRedirect('/admin/books');
}
