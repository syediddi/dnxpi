using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace DnxPi.Controllers
{
    public class PiController : Controller
    {
		 public IActionResult Index()
        {
            return View();
        }
	}
}