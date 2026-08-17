import { redirect } from 'next/navigation';

export default function LegacyPostsManagementPage() {
    redirect('/admin/posts');
}
