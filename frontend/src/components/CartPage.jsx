import immagini from "../utils/images";

function CartPage({ cart, handleMinus, handlePlus, handleRemove }) {
  const total = Array.isArray(cart)
    ? cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.quantity; //itera l'oggetto e moltiplica le due proprietà price e quantity
      }, 0)
    : console.log("Expected cart to be an array, but got:", cart);

  return (
    <>
      <h1 className="riepilogo">Riepilogo Carrello</h1>
      <section className="cart-page">
        {cart.map((item) => {
          return (
            <div className="cart-page-container" key={item._id}>
              <img src={item.image} alt={item.name} />
              <h2>{item.name}</h2>
              <h1>{item.price ? item.price.toFixed(2) : "0.00"} euro</h1>
              <div className="quantity-container">
                <p>{item.quantity}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="plus"
                  viewBox="0 0 16 16"
                  onClick={() => {
                    handlePlus(item._id, item.quantity); // approccio passando solo due proprietà
                  }}
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="minus"
                  viewBox="0 0 16 16"
                  onClick={() => {
                    handleMinus(item); //approccio passando l'intero oggetto
                  }}
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                </svg>
                <button
                  onClick={() => {
                    handleRemove(item);
                  }}
                >
                  Rimuovi dal carrello
                </button>
              </div>
            </div>
          );
        })}
        <div className="bottom-cart">
          <p>Totale:{total.toFixed(2)} euro</p>

          <button>Prosegui con il pagamento</button>
        </div>
      </section>
    </>
  );
}

export default CartPage;
