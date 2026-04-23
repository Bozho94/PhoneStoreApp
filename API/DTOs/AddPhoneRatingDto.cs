using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AddPhoneRatingDto
{
    [Range(1, 5)]
    public int Rating { get; set; }
}
