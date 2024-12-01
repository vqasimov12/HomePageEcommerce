const pageSize = 8;
let currentPage = 1;

const getProducts = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products?pageSize=${pageSize}&page=${currentPage}`
    );

    if (!response.ok) throw new Error("Fetch failed");

    const data = await response.json();
    const totalPages = data.totalPages;
    updateProducts(data);

    currentPage++;

    if(currentPage>totalPages){
        $("#viewMoreBtn").css("display","none");
    }
  } catch (error) {
    console.error(error);
  }
};

function updateProducts(data) {
  const products = data.products;

  console.log(products);

  products.map((product) => {
    console.log(product);
    var parentDiv = $("<div></div>");
    parentDiv.css({
      width: "290px",
      height: "400px",
      display: "flex",
      "flex-direction": "column",
    });

    var childDiv = $("<div></div>");
    childDiv.css({
      width: "290px",
      height: "270px",
      "background-color": "#F5F5F5",
      "border-radius": "4px",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "flex-direction": "column",
      overflow: "hidden",
      position: "relative",
    });

    var img = $("<img>");
    img.attr("src", product.gallery[0]);

    img.css({
      width: "65%",
      height: "auto",
      padding: "20px",
      position: "relative",
      "z-index": "0",
    });

    var hoverDiv = $("<div></div>");
    hoverDiv
      .css({
        "background-color": "black",
        color: "white",
        "font-size": "16px",
        "font-family": "poppins",
        "font-weight": "500",
        display: "none",
        "justify-content": "center",
        "align-items": "center",
        width: "290px",
        height: "41px",
        bottom: "0",
        "border-bottom-left-radius": "4px",
        "border-bottom-right-radius": "4px",
        position: "absolute",
        "z-index": "1",
      })
      .text("Add to basket");

    childDiv.append(img);
    childDiv.append(hoverDiv);
    childDiv.mouseenter(() => {
      hoverDiv.css("display", "flex");
    });
    childDiv.mouseleave(() => {
      hoverDiv.css("display", "none");
    });

    var title = $("<h3></h3>");
    title
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        "padding-top": "16px",
      })
      .text(product.title);

    var price = $("<p></p>");
    price
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        color: "#DB4444",
        "padding-bottom": "60px",
      })
      .text("$" + product.price);

    parentDiv.append(childDiv);
    parentDiv.append(title);
    parentDiv.append(price);

    $("#productsDiv").append(parentDiv);
  });
}

getProducts();

$("#viewMoreBtn").click(() => getProducts());
