using System;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
	public class Zipcode
	{
        [Key]
        public string Zip { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
	}
}

