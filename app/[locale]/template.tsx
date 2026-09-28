// Templates remount on every navigation, so the curtain replays per page.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden='true' className='page-curtain' />
      {children}
    </>
  );
}
