import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Modal from "@/components/ui/Modal";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Modal", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    document.body.style.overflow = "";
  });

  it("should render when isOpen is true", () => {
    render(
      <Modal isOpen title="Test Modal" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should not render content when isOpen is false", () => {
    render(
      <Modal isOpen={false} title="Hidden Modal" onClose={jest.fn()}>
        <p>Hidden</p>
      </Modal>
    );
    expect(screen.queryByText("Hidden Modal")).not.toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen title="Close Test" onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText("Fechar modal"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Escape key is pressed", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen title="Escape Test" onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose for non-Escape keys", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen title="Key Test" onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should set body overflow to hidden when open", () => {
    render(
      <Modal isOpen title="Overflow Test" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore body overflow when closed", () => {
    const { rerender } = render(
      <Modal isOpen title="Overflow Restore" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    rerender(
      <Modal isOpen={false} title="Overflow Restore" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("should render with md size by default", () => {
    render(
      <Modal isOpen title="Size Test" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    const modalContent = screen.getByText("Size Test").closest("div")?.parentElement;
    expect(modalContent?.className).toContain("max-w-lg");
  });

  it("should render with lg size when specified", () => {
    render(
      <Modal isOpen size="lg" title="Large Modal" onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    const modalContent = screen.getByText("Large Modal").closest("div")?.parentElement;
    expect(modalContent?.className).toContain("max-w-2xl");
  });
});
