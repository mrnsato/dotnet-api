using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
    {

            [Table("versions")]
            public class Version {
            [Column("id")]
            public int Id { get; set; }
            [Column("name")]
            public string Name { get; set; } = string.Empty;
            [Column("technologies_id")]
            public int TechnologiesId { get; set; }

            [ForeignKey("TechnologiesId")]
            public Technology Technology { get; set; } = new Technology();
            [Column("standard")]
            public bool Standard { get; set; }
            [Column("full_name")]
            public string FullName { get; set; } = string.Empty;
            [Column("eos")]
            public DateOnly? Eos { get; set; }
            [Column("eol")]
            public DateOnly? Eol { get; set; }

        }
    }