using Microsoft.AspNetCore.Mvc;
using TechTest.Repositories;

namespace TechTest.Controllers
{
    [Route("api/colours")]
    [ApiController]
    public class ColoursController : ControllerBase
    {
        public ColoursController(IColourRepository colourRepository)
        {
            this.ColourRepository = colourRepository;
        }

        private IColourRepository ColourRepository { get; }

        [HttpGet]
        public IActionResult GetAll()
        {
            var colours =  this.ColourRepository.GetAll();

            return this.Ok(colours);
        }
    }
}
