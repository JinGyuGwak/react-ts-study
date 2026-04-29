import "./App.css";
import { Routes, Route, Outlet } from "react-router";
import IndexPage from "./pages/sign-in-page";
import SignInPage from "./pages/index-page";
import SignUpPage from "./pages/sign-up-page";
import CounterPage from "./pages/counter-page";
import TodoListPage from "./pages/todo-list-page";

function AuthLayout() {
  return (
    <div>
      <header>Auth!</header>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/counter" element={<CounterPage />} />
      <Route path="/todos" element={<TodoListPage />}></Route>

      {/* 공통 레이아웃을 적용하기 위한 코드 */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
}

export default App;
