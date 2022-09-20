import PopupWithForm from "./PopupWithForm";

function ConfirmationPopup({ isPopupOpened, onClose, card, onDeleteCard }) {
  function handleSubmit(event) {
    event.preventDefault();

    onDeleteCard(card);
  }

  return (
    <PopupWithForm
      name="confirmation"
      title="Вы уверены?"
      type="updated"
      button="Да"
      isPopupOpened={isPopupOpened}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={true}
    >
    </PopupWithForm>
  );
}

export default ConfirmationPopup;
