export function Card({ children }) {
    return <div className="bg-white shadow-[0px_0px_54px_rgba(0,0,0,0.07)] rounded-[16px] p-4">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }