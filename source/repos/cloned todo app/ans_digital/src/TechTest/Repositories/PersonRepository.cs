using System;
using System.Collections.Generic;
using System.Linq;
using TechTest.Repositories.Models;

namespace TechTest.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        public PersonRepository()
        {
            this.Collection = InMemoryCollection;
        }

        private IList<Person> Collection { get; set; }

        public IEnumerable<Person> GetAll()
        {
            return this.Collection;
        }

        public Person Get(int id)
        {
            var person = this.Collection.SingleOrDefault(p => p.Id == id);

            return person;
        }

        public Person Update(Person person)
        {
            if (person == null)
            {
                throw new ArgumentNullException();
            }

            var existing = this.Collection.SingleOrDefault(p => p.Id == person.Id);

            if (existing != null)
            {
                this.Collection = this.Collection.Except(new List<Person> { existing }).ToList();
                this.Collection.Add(person);

                existing = person;
            }

            return existing;
        }

       

        private static IList<Person> InMemoryCollection { get; } = new List<Person>
            {
                new Person { Id = 1, FirstName = "Bo", LastName = "Bob", Authorised = true, Enabled = false, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" } } },
                new Person { Id = 2, FirstName = "Brian", LastName = "Allen", Authorised = true, Enabled = true, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" }, new Colour { Id = 2, Name = "Green" } , new Colour { Id = 3, Name = "Blue" } } },
                new Person { Id = 3, FirstName = "Courtney", LastName = "Arnold", Authorised = true, Enabled = true, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" } } },
                new Person { Id = 4, FirstName = "Gabriel", LastName = "Francis", Authorised = false, Enabled = false, Colours = new List<Colour> { new Colour { Id = 2, Name = "Green" } } },
                new Person { Id = 5, FirstName = "George", LastName = "Edwards", Authorised = true, Enabled = false, Colours = new List<Colour> { new Colour { Id = 2, Name = "Green" }, new Colour { Id = 3, Name = "Blue" } } },
                new Person { Id = 6, FirstName = "Imogen", LastName = "Kent", Authorised = false, Enabled = false, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" }, new Colour { Id = 2, Name = "Green" } } },
                new Person { Id = 7, FirstName = "Joel", LastName = "Daly", Authorised = true, Enabled = true, Colours = new List<Colour> { new Colour { Id = 2, Name = "Green" } } },
                new Person { Id = 8, FirstName = "Lilly", LastName = "Hale", Authorised = false, Enabled = false, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" }, new Colour { Id = 2, Name = "Green" } , new Colour { Id = 3, Name = "Blue" } } },
                new Person { Id = 9, FirstName = "Patrick", LastName = "Kerr", Authorised = true, Enabled = true, Colours = new List<Colour> { new Colour { Id = 2, Name = "Green" } } },
                new Person { Id = 10, FirstName = "Sharon", LastName = "Halt", Authorised = false, Enabled = false, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" }, new Colour { Id = 2, Name = "Green" } , new Colour { Id = 3, Name = "Blue" } } },
                new Person { Id = 11, FirstName = "Willis", LastName = "Tibbs", Authorised = true, Enabled = false, Colours = new List<Colour> { new Colour { Id = 1, Name = "Red" }, new Colour { Id = 2, Name = "Green" } , new Colour { Id = 3, Name = "Blue" } } },
            };
    }
}
