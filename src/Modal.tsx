import React from "react"

interface Props {
  onDismiss(): void
}

function Modal({ onDismiss }: Props) {
  return (
    <>
      <div className="modalOverlay" onClick={onDismiss} />
      <div className="modal">
        <button className="modalClose" onClick={onDismiss}>
          close
        </button>
        <div className="modalContent">
          <h1>Important Disclaimer</h1>
          <p>
            I don't hold the crystal ball of course scheduling. Use this tool at
            your own risk, and always consult with a department advisor for
            scheduling questions or concerns. Past results do not guarantee
            future outcomes.
          </p>
        </div>
      </div>
    </>
  )
}

export default Modal
