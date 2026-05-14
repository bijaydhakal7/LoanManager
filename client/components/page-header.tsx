type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
  );
};
