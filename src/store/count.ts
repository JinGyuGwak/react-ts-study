import { create } from "zustand";
import {
  combine,
  subscribeWithSelector,
  persist,
  createJSONStorage,
  devtools,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useCountStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer(
          combine({ count: 0 }, (set, get) => ({
            actions: {
              increase: () => {
                set((state) => {
                  state.count += 1;
                });
              },
              decrease: () => {
                set((state) => {
                  state.count -= 1;
                });
              },
            },
          }))
        )
      ),
      {
        name: "countStore",
        partialize: (x) => ({
          count: x.count,
        }),
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: "countStore",
    }
  )
);

useCountStore.subscribe(
  (store) => store.count,
  (count, prevCount) => {
    //매개변수로 들어오는 객체store 의 count 값이 바뀔때마다 실행할 함수
    console.log(count, prevCount);

    const store = useCountStore.getState();
    // useCountStore.setState(() => ({}));
  }
);

// export const useCountStore = create<Store>((set, get) => ({
//   count: 0,
//   actions: {
//     increase: () => {
//       set((store) => ({
//         count: store.count + 1,
//       }));
//     },
//     decrease: () => {
//       set((store) => ({
//         count: store.count - 1,
//       }));
//     },
//   },
// }));

export const useCount = () => {
  // 1. useCountStore()는 콜백함수를 받음
  // 2. Zustand 내부에서 Store 객체를 x로 전달
  // 3. x.count 실행 → 0 반환
  // 4. useCountStore()가 0을 반환 (Store 객체 전체가 아님!)
  // 5. count = 0
  const count = useCountStore((x) => x.count);
  return count;
};

export const useIncrease = () => {
  const increase = useCountStore((store) => store.actions.increase);
  return increase;
};

export const useDecrease = () => {
  const decrease = useCountStore((store) => store.actions.decrease);
  return decrease;
};

/*
Zustand 내부 코드 (단순화 버전)

function useCountStore(selector) {
  // 1. 현재 Store 상태를 가져옴
  const currentStore = {
    count: 0,
    actions: { increase: ..., decrease: ... }
  };
  
  // 2. selector가 있으면 실행, 없으면 전체 반환
  if (selector) {
    // selector 함수에 currentStore를 넣어서 실행!
    return selector(currentStore);
  } else {
    return currentStore;
  }
}

*/

/*
실제 실행 과정
useCountStore((x) => x.count)

↓ Zustand 내부에서

function useCountStore(selector) {
  // selector = (x) => x.count 라는 함수가 들어옴
  
  const currentStore = { count: 0, actions: {...} };
  
  // selector(currentStore) 실행
  return selector(currentStore);
  //     ↓
  //     ((x) => x.count)(currentStore)
  //     ↓
  //     x를 currentStore로 치환
  //     ↓
  //     currentStore.count
  //     ↓
  //     0
}
*/
