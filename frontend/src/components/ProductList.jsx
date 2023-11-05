import AddToCart from "./AddToCart";

function ProductList({ info, addToCart }) {
  return (
    <main>
      <section className="product-container">
        {info.map((dato, index) => {
          return (
            <div className="item-container" key={dato._id}>
              <img src={dato.image} alt={dato.name} />
              <h2>{dato.name}</h2>
              <p>{dato.description}</p>
              <h1>{dato.price.toFixed(2)}</h1>
              <AddToCart addToCart={addToCart} productId={dato._id} />
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default ProductList;
