import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-muted-foreground mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-sm bg-muted p-4 rounded-md">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
