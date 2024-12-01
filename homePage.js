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
      const url = `http://localhost:3000/api/products?searchTerm=${searchQuery}`;
      const products = await getProducts(url);

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

const getProducts = async (query) => {
  const response = await fetch(query);
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

document.cookie = `access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N…jM1fQ.UYMejnEng_aifEy9RO7I_FNZYDCZ8r3VIiKUFVgeXaE', refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N…TM1fQ.y4jXku_JKGg1t7nHKlYHQT6mnxTeHbZ5v2z-IsUy07g`;

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
