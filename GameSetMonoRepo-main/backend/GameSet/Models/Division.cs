using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class Division
    {
        [Key]
        public int DivisionID { get; set; }
        [Required]
        [StringLength(255)] // Adjust the length as per your database schema if needed
        public string DivisionName { get; set; }
    }
}
