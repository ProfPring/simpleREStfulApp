using System.Collections.Generic;

namespace TechTest.Repositories.Models  
{
    public class Person 
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool Authorised { get; set; }

        public bool Enabled { get; set; }

        public IEnumerable<Colour> Colours { get; set; }
    }
}
