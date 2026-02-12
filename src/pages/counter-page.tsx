import { Button } from "@/components/ui/button";
import { useCountStore } from "@/store/count";

export default function CounterPage() {
  const store = useCountStore();
  return (
    <div>
      <h1 className="text-2xl font-bold">Counter</h1>
      <div>{store.count}</div>
      <div>
        <Button onClick={store.decrease}>-</Button>
        <Button onClick={store.increase}>+</Button>
      </div>
    </div>
  );
}
