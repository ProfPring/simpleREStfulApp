using System.Collections.Generic;
using TechTest.Repositories.Models;

namespace TechTest.Repositories
{
    public interface IPersonRepository
    {
        IEnumerable<Person> GetAll();

        Person Get(int id);

        Person Update(Person person);
    }
}
