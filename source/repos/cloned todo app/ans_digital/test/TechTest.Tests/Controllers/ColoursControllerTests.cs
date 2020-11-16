using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using TechTest.Controllers;
using TechTest.Repositories;
using TechTest.Repositories.Models;

namespace TechTest.Tests.Controllers
{
    [TestClass]
    public class ColoursControllerTests
    {
        [TestMethod]
        public void GetAll_Calls_Repository()
        {
            // Arrange
            var mockRepo = new Mock<IColourRepository>();
            mockRepo.Setup(repo => repo.GetAll()).Returns(GetTestColours().AsEnumerable());
            var controller = new ColoursController(mockRepo.Object);

            // Act
            controller.GetAll();

            // Assert
            mockRepo.Verify(mock => mock.GetAll(), Times.Once());
        }

        [TestMethod]
        public void GetAll_Returns_Ok()
        {
            // Arrange
            var mockRepo = new Mock<IColourRepository>();
            mockRepo.Setup(repo => repo.GetAll()).Returns(GetTestColours().AsEnumerable());
            var controller = new ColoursController(mockRepo.Object);

            // Act
            var result = controller.GetAll();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        }

        [TestMethod]
        public void GetAll_Returns_Colours()
        {
            // Arrange
            var mockRepo = new Mock<IColourRepository>();
            var colours = GetTestColours();
            mockRepo.Setup(repo => repo.GetAll()).Returns(colours.AsEnumerable());
            var controller = new ColoursController(mockRepo.Object);

            // Act
            var result = controller.GetAll();
            var objectResult = result as OkObjectResult;
            var value = objectResult?.Value as IEnumerable<Colour>;

            // Assert
            Assert.IsInstanceOfType(value, typeof(IEnumerable<Colour>));
            Assert.AreEqual(colours.Count, value?.Count());
        }

        [TestMethod]
        public void GetAll_Returns_Empty_List()
        {
            // Arrange
            var mockRepo = new Mock<IColourRepository>();
            mockRepo.Setup(repo => repo.GetAll()).Returns(EmptyList);
            var controller = new ColoursController(mockRepo.Object);

            // Act
            var result = controller.GetAll();
            var objectResult = result as OkObjectResult;
            var value = objectResult?.Value as IEnumerable<Colour>;

            // Assert
            Assert.IsInstanceOfType(value, typeof(IEnumerable<Colour>));
            Assert.AreEqual(0, value?.Count());
        }

        private static IList<Colour> GetTestColours()
        {
            var colours = new List<Colour>
            {
                new Colour { Id = 1, Name = "Red" },
                new Colour { Id = 2, Name = "Green" },
                new Colour { Id = 3, Name = "Blue" }
            };

            return colours;
        }

        private static IEnumerable<Colour> EmptyList => new List<Colour>();
    }
}
