import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ToastContainer from "@/components/ui/Toast";
import { Toast } from "@/hooks/useToast";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ToastContainer", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockToasts: Toast[] = [
    { id: "1", message: "Success message", type: "success" },
    { id: "2", message: "Error message", type: "error" },
    { id: "3", message: "Info message", type: "info" },
  ];

  it("should render all toasts", () => {
    render(<ToastContainer toasts={mockToasts} onRemove={jest.fn()} />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("should render empty when no toasts", () => {
    render(<ToastContainer toasts={[]} onRemove={jest.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call onRemove when close button is clicked", () => {
    const onRemove = jest.fn();
    render(
      <ToastContainer
        toasts={[{ id: "t1", message: "Close me", type: "info" }]}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByLabelText("Fechar notificação"));
    expect(onRemove).toHaveBeenCalledWith("t1");
  });

  it("should apply success styles for success toast", () => {
    render(
      <ToastContainer
        toasts={[{ id: "s1", message: "Good", type: "success" }]}
        onRemove={jest.fn()}
      />
    );
    const toast = screen.getByText("Good").closest("div");
    expect(toast?.className).toContain("bg-green-900");
  });

  it("should apply error styles for error toast", () => {
    render(
      <ToastContainer
        toasts={[{ id: "e1", message: "Bad", type: "error" }]}
        onRemove={jest.fn()}
      />
    );
    const toast = screen.getByText("Bad").closest("div");
    expect(toast?.className).toContain("bg-red-900");
  });

  it("should render multiple close buttons for multiple toasts", () => {
    render(<ToastContainer toasts={mockToasts} onRemove={jest.fn()} />);
    expect(screen.getAllByLabelText("Fechar notificação")).toHaveLength(3);
  });
});
