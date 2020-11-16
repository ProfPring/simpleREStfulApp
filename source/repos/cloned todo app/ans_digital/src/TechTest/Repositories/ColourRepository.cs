using System.Collections.Generic;
using TechTest.Repositories.Models;

namespace TechTest.Repositories
{
    public class ColourRepository : IColourRepository
    {
        public ColourRepository()
        {
            this.Collection = InMemoryCollection;
        }

        private IEnumerable<Colour> Collection { get; }

        public IEnumerable<Colour> GetAll()
        {
            return this.Collection;
        }

        private static IEnumerable<Colour> InMemoryCollection { get; } = new List<Colour>
        {
            new Colour {Id = 1, Name = "Red"},
            new Colour {Id = 2, Name = "Green"},
            new Colour {Id = 3, Name = "Blue"}
        };
    }
}
