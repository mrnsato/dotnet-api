
using System.ComponentModel.DataAnnotations.Schema;

namespace  Entities
{
        [Table("applications")]
    public class Application {
        [Column("id")]
        public int Id { get; set; }
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        [Column("active")]
        public bool? Active { get; set; }
    }
}