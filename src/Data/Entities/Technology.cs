using System.ComponentModel.DataAnnotations.Schema;

namespace  Entities
    {
            [Table("technologies")]
            public class Technology {
            [Column("id")]
            public int Id { get; set; }
            [Column("name")]
            public string Name { get; set; } = string.Empty;
            public ICollection<Version> Versions { get; set; } = new List<Version>();
        }
    }
