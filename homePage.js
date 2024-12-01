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

    if (currentPage > totalPages) {
      $("#viewMoreBtn").css("display", "none");
    }
  } catch (error) {
    console.error(error);
  }
};

function updateProducts(data) {
  const products = data.products;

  // console.log(products);

  products.map((product) => {
    // console.log(product);
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

$("#profileBtn").click((event) => {
  const profileOptions = $("#profileOptions");

  event.stopPropagation();

  if (profileOptions.hasClass("hidden")) {
    profileOptions.removeClass("hidden").fadeIn(200);
  } else {
    profileOptions.fadeOut(200, () => {
      profileOptions.addClass("hidden");
    });
  }
});

$("#body").click(() => {
  const profileOptions = $("#profileOptions");

  if (!profileOptions.hasClass("hidden")) {
    setTimeout(() => {
      profileOptions.fadeOut(200, () => {
        profileOptions.addClass("hidden");
      });
    }, 10);
  }
});

$("#searchInput").on("keydown", async function (event) {
  if (event.key === "Enter") {
    const searchQuery = $("#searchInput").val().trim();
    if (searchQuery) {
      $("#searchedText").text(searchQuery);
      $("#overLay").removeClass("hidden").fadeIn(200);
      $("#body").addClass("overflow-hidden");
      const products = await searchProducts(searchQuery);
      if (products.length !== 0) {
        $("#notFound").fadeOut(200, function () {
          $(this).addClass("hidden");
          createCardItems(products);
        });
      } else {
        $("#notFound").removeClass("hidden").fadeIn(200);
      }
    } else {
      console.log("Input is empty!");
    }
  }
});

$("#overLay").click((event) => {
  if (event.target === event.currentTarget) {
    $("#overLay").fadeOut(200, function () {
      $(this).addClass("hidden");
      $("#body").removeClass("overflow-hidden");
    });
  }
});

const searchProducts = async (term) => {
  const url = `http://localhost:3000/api/products?p
ageSize:${pageSize}&searchTerm:${term}
`;
  const response = await fetch(url);
  try {
    if (!response.ok) {
      throw new Error("Failed to fetch product data. Please try again later");
    }

    const data = await response.json();
    return data.products;
  } catch (e) {
    console.log(e.message);
    $("#notFound").fadeIn(200, function () {
      $(this).removeClass("hidden");
    });
  }
};

$("#myProfileLink").click(() => {
  if (document.cookie.includes("access_token="))
    window.location.href = "/profile.html";
  else window.location.href = "/signup.html";
});

$("#myAccount").click(() => {
  if (document.cookie.includes("access_token="))
    window.location.href = "/profile.html";
  else window.location.href = "/signup.html";
});

$("#shoppingCartLink").click(() => {
  if (document.cookie.includes("access_token="))
    window.location.href = "/basket.html";
  else window.location.href = "/signup.html";
});
$("#basketLink").click(() => {
  if (document.cookie.includes("access_token="))
    window.location.href = "/basket.html";
  else window.location.href = "/signup.html";
});

$("#logOutBtn").click(
  () => (document.cookie = "access_token=; path=/; max-age=0")
);

const createCard = (item) => {
  const card = $("<div>").addClass("card w-[270px] h-[320px] gap-4 mt-[60px]");

  const secondDiv = $("<div>").addClass(
    "p-[5px] rounded-[4px] flex w-[270px] bg-[#f5f5f5] h-[220px] items-center justify-center"
  );
  const image = $("<img>")
    .addClass(" h-[160px] object-cover rounded-md")
    .attr("src", item.gallery[0]);
  secondDiv.append(image);
  card.append(secondDiv);
  const title = $("<h2>")
    .addClass("font-poppins text-base font-medium mt-4 leading-6 text-left")
    .text(item.title);
  card.append(title);

  const price = $("<p>")
    .addClass(
      "font-poppins text-base font-medium mt-2 leading-6 text-left text-[#DB4444]"
    )
    .text(`$${item.price}`);
  card.append(price);
  $("#searchProducts").append(card);
};

const createCardItems = (products) => {
  $("#searchProducts").html("");
  products.map((product) => {
    createCard(product);
  });
};

getProducts();

$("#viewMoreBtn").click(() => getProducts());

document.cookie = `access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N…jM1fQ.UYMejnEng_aifEy9RO7I_FNZYDCZ8r3VIiKUFVgeXaE', refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N…TM1fQ.y4jXku_JKGg1t7nHKlYHQT6mnxTeHbZ5v2z-IsUy07g`;
