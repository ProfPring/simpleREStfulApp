using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TechTest.Repositories;
using TechTest.Repositories.Models;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Net.Http;
using System.Net;
using Nancy.Json;
using Nancy.Json.Simple;
using Microsoft.SqlServer.Server;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Runtime.ExceptionServices;

namespace TechTest.Controllers
{
    [Route("api/people")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private JavaScriptSerializer Jss = new JavaScriptSerializer();

        private Person getPersonByID(IEnumerable<Person> allPeople, int id)
        {
            //make an new person object 
            var PersonOfInterest = new Person();
            foreach (var person in allPeople)
            {
                if (person.Id == id)
                {
                    //break when the person is found and sent person of interest
                    PersonOfInterest = person;
                    break;
                }
            }
            return PersonOfInterest;
        }


        public PeopleController(IPersonRepository personRepository)
        {
            this.PersonRepository = personRepository;
        }

        private IPersonRepository PersonRepository { get; }

        [HttpGet]
        public IActionResult GetAll()
        {
            // TODO: Step 1
            //
            // Implement a JSON endpoint that returns the full list
            // of people from the PeopleRepository. If there are zero
            // people returned from PeopleRepository then an empty
            // JSON array should be returned.

            var allPeople = PersonRepository.GetAll();
            //return a Serialized json array to the front end
            return Content(Jss.Serialize(allPeople));
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // TODO: Step 2
            //
            // Implement a JSON endpoint that returns a single person
            // from the PeopleRepository based on the id parameter.
            // If null is returned from the PeopleRepository with
            // the supplied id then a NotFound should be returned.

            var allPeople = PersonRepository.GetAll();

            var PersonOfInterest = this.getPersonByID(allPeople, id);
            if (PersonOfInterest == null)
            {
                return NotFound();
            }
            else
            {
                return Content(Jss.Serialize(PersonOfInterest));
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PersonUpdate personUpdate)
        {

            // TODO: Step 3
            //
            // Implement an endpoint that receives a JSON object to
            // update a person using the PeopleRepository based on
            // the id parameter. Once the person has been successfully
            // updated, the person should be returned from the endpoint.
            // If null is returned from the PeopleRepository then a
            // NotFound should be returned.


            /*
             * BUG: appends new colours onto old this.person.colours list 
             * 
             * I have spotted a bug in the where by if you change the persons favorite colour
             * it submits the old colour and the new colour. 
             * I have tried to fix this problem in a number of ways.
             * 
             * below  I tried to implement a solution that works for some cases.
             * 
             * SOLUTION: 
             * check if the colours list is the same as the updated list if it is the same then update the perosn but leave the colours.
             * if it is not the same then cut  off the first extraneous element. and update the person object with the new colours. 
             * 
             * I am aware there is some issues with the solution for example when you want to change all three options to a singluar option 
             * it does not work, I know there must be a more elegant and simple solution and would love to talk more about what needs to be done.
             * 
             * if I had a similar problem in the future I would ask a team memeber to help me out with fixing the issue. 
             *  
             */



            var allPeople = PersonRepository.GetAll();
            var PersonOfInterest = this.getPersonByID(allPeople, id);

            var colours = personUpdate.Colours.ToList();
            var firstelement = colours[0];
            if (colours.Count > 1) 
            {
                colours.Remove(firstelement);
            }
            
            foreach (var colour1 in PersonOfInterest.Colours) 
            {
                
                foreach (var colour2 in colours) 
                {
                    
                    if (colour1.Name == colour2.Name)
                    {
                        PersonOfInterest.Authorised = personUpdate.Authorised;
                        PersonOfInterest.Enabled = personUpdate.Enabled;
                        //PersonOfInterest.Colours = personUpdate.Colours;

                        if (PersonOfInterest != null)
                        {
                            return Content(Jss.Serialize(PersonOfInterest));
                        }
                        else 
                        {
                            return NotFound();
                        }
                    }
                    else 
                    {
                        PersonOfInterest.Authorised = personUpdate.Authorised;
                        PersonOfInterest.Enabled = personUpdate.Enabled;
                        PersonOfInterest.Colours = colours;

                        if (PersonOfInterest != null)
                        {
                            return Content(Jss.Serialize(PersonOfInterest));
                        }
                        else 
                        {
                            return NotFound();
                        }
                    }
                }
            }
            return NotFound();
        }
    }
}