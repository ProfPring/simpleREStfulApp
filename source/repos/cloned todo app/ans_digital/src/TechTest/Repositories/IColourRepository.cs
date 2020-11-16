using System.Collections.Generic;
using TechTest.Repositories.Models;

namespace TechTest.Repositories
{
    public interface IColourRepository
    {
        IEnumerable<Colour> GetAll();
    }
}